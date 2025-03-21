import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

        const filePath = path.join(uploadDir, uniqueName);
        const stream = fs.createWriteStream(filePath);
        stream.write(Buffer.from(await file.arrayBuffer()));

        return NextResponse.json({
            filename: uniqueName,
            url: `/uploads/${uniqueName}`,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }
}