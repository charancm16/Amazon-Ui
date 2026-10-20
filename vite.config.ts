import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-root-images',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next()
          // match /1.jpg to /10.jpg or /images/amazon-01.jpg etc.
          const numMatch = req.url.match(/^\/(?:images\/amazon-0?(\d+)\.jpg|images\/(\d+)\.jpg|(\d+)\.jpg)/)
          if (numMatch) {
            const num = numMatch[1] || numMatch[2] || numMatch[3]
            const filePath = path.resolve(__dirname, `${num}.jpg`)
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'image/jpeg')
              res.setHeader('Cache-Control', 'public, max-age=31536000')
              fs.createReadStream(filePath).pipe(res)
              return
            }
          }
          next()
        })
      }
    }
  ],
  server: {
    fs: {
      allow: ['..', '.']
    }
  }
})