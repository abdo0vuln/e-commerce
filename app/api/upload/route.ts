import { NextResponse } from "next/server"
import formidable from "formidable"
import fs from "fs"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  const form = formidable({
    multiples: false,
    uploadDir: uploadsDir,
    keepExtensions: true,
    filename: (_name: string, ext: string, _part: unknown) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
      return `${unique}${ext}`
    },
  })

  return new Promise((resolve) => {
    form.parse(req as any, (err: any, fields: formidable.Fields, files: formidable.Files) => {
      if (err) {
        resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }))
        return
      }
      let file = files.file as formidable.File | formidable.File[]
      if (Array.isArray(file)) file = file[0]
      const fileUrl = `/uploads/${path.basename(file.filepath)}`
      resolve(NextResponse.json({ url: fileUrl }))
    })
  })
} 