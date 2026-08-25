import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { __dirname } from "../index.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { delfile } from "./delete_file.js";
import { getIo } from './socket.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const execPromise = util.promisify(exec);

export const pdfConvertFunc = async (pdf_path, img_folder, image_name) => {
    let full_pdf_path;
    if (pdf_path.startsWith(__dirname)) {
        full_pdf_path = pdf_path;
    } else {
        const cleanPath = pdf_path.replace(/^[/\\]+/, '');
        full_pdf_path = path.resolve(__dirname, cleanPath);
    }

    const img_path = path.join(__dirname, 'uploads', img_folder, image_name);

    if (!fs.existsSync(img_path)) {
        fs.mkdirSync(img_path, { recursive: true });
    }

    const output_prefix = path.join(img_path, image_name);
    const cmd = `pdftoppm "${full_pdf_path}" "${output_prefix}" -png`;

    try {
        await execPromise(cmd);
        const files = fs.readdirSync(img_path);
        const escapedName = image_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const image_arr = files
            .filter(file => file.startsWith(image_name) && file.endsWith(".png"))
            .sort((a, b) => {
                const regex = new RegExp(`${escapedName}-(\\d+)\\.png$`);
                const numA = parseInt(a.match(regex)?.[1] || "0", 10);
                const numB = parseInt(b.match(regex)?.[1] || "0", 10);
                return numA - numB;
            })
            .map(file => path.join(img_path, file));

        const reports = [];
        for (const imgPath of image_arr) {
            const base64 = toBase64(imgPath);
            await delfile(imgPath);
            const report = await analyzeHandwrittenImage(base64);
            reports.push(report);
        }

        if (fs.existsSync(img_path)) {
            fs.rmSync(img_path, { recursive: true, force: true });
        }

        getIo().emit('report', 'success');
        return reports;
    } catch (error) {
        getIo().emit('report', 'Failed');
        console.error("pdfConvertFunc Function error:", error);
        throw error;
    }
};

// Read image and convert to base64
const toBase64 = (filePath) => {
    const data = fs.readFileSync(filePath);
    return data.toString("base64");
};

// Send image to Gemini Vision for JSON report
export const analyzeHandwrittenImage = async (base64Image) => {
    let result = null;
    let lastError = null;

    const candidateModels = [
        process.env.GEMINI_MODEL,
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash"
    ].filter(Boolean);
    const uniqueModels = [...new Set(candidateModels)];

    for (const modelName of uniqueModels) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName
            });
            result = await model.generateContent({
                contents: [
                    {
                        parts: [
                            {
                                text: `Assume you are a report generator Extract Json like this
                        {
                            "name": "(Person name in english)(Person name in hindi)",
                            "mobileNo": 987,
                            "wardNo": 1,
                            "numberOfProblems": 5,
                            "problems": [
                                {
                                    "tags": ["Problem related tags"],
                                    "english": "problem in english",
                                    "hindi": "problem in hindi language"
                                }
                            ]
                        }
                        Return json only 
                        if english or hindi not present convert both and give me both filled
                        Make everything in this format and if tags are not found make them in others category
                                `,
                            },
                            {
                                inlineData: {
                                    mimeType: "image/jpeg",
                                    data: base64Image,
                                },
                            },
                        ],
                    },
                ],
            });
            if (result) break;
        } catch (err) {
            lastError = err;
            console.warn(`Gemini model '${modelName}' failed, trying next candidate:`, err.message);
        }
    }

    if (!result) {
        throw lastError || new Error("Failed to generate content with any Gemini model.");
    }

    const response = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    try {
        const cleanedRaw = response?.trim()
            .replace(/^```json\n?/i, '')  // remove starting ```json
            .replace(/^```/, '')      // in case it's just ``` instead of ```json
            .replace(/```$/, '')      // remove ending ```
            .trim();
        return JSON.parse(cleanedRaw);
    } catch {
        return { raw: response };
    }
};