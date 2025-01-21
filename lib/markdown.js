import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'
import { remarkImagePath } from './remarkImagePath'

export async function getMarkdownData(filePath) {
  // Read markdown file
  const fileContents = fs.readFileSync(filePath, 'utf8')

  // Parse front matter
  const { data, content } = matter(fileContents)

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkImagePath)
    .use(html, { sanitize: false })
    .use(prism)
    .process(content)
  
  const contentHtml = processedContent.toString()

  return {
    ...data,
    content: contentHtml
  }
}

export function getAllMarkdownFiles(directory) {
  const dir = path.join(process.cwd(), directory)
  const filenames = fs.readdirSync(dir)
  
  return filenames.map(filename => {
    const filePath = path.join(dir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    
    return {
      ...data,
      slug: filename.replace(/\.md$/, '')
    }
  })
}

export function getMarkdownPaths(directory) {
  const dir = path.join(process.cwd(), directory)
  const filenames = fs.readdirSync(dir)
  
  return filenames.map(filename => ({
    params: {
      slug: filename.replace(/\.md$/, '')
    }
  }))
}
