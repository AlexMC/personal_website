# Steps to Build a Personal Website Mimicking wojtek.im

## Step 1: Set Up Your Development Environment 

1. **Install Prerequisites:** 

   - Install [Node.js](https://nodejs.org/) (preferably the latest LTS version).
   - Install a code editor like [Visual Studio Code](https://code.visualstudio.com/).
   - Install [Git](https://git-scm.com/) for version control.

2. **Initialize a Project:** 

   - Create a new directory for your website: `mkdir personal-website && cd personal-website`.
   - Initialize a new Git repository: `git init`.

3. **Use a Requirements File for Dependencies:** 

   - Create a `package.json` file listing your dependencies:
     ```json
     {
       "name": "personal-website",
       "version": "1.0.0",
       "scripts": {
         "dev": "next dev",
         "build": "next build",
         "start": "next start"
       },
       "dependencies": {
         "next": "latest",
         "react": "latest",
         "react-dom": "latest"
       },
       "devDependencies": {
         "autoprefixer": "latest",
         "postcss": "latest",
         "tailwindcss": "latest"
       }
     }
     ```
   - Install dependencies with: `npm install`.

## Step 2: Create the Website Structure 

### Pages

1. **Home Page (`index.js`):** 

   - Create a minimalist hero section with your name and a brief introduction.
   - Add a scrolling or static list of sections (e.g., Work, Blog, About).

2. **Work Page (`work.js`):** 

   - Showcase your projects with titles, short descriptions, and links.
   - Use Tailwind CSS for a grid layout.

3. **Blog Page (`blog.js`):** 

   - Include a list of blog posts with titles, publication dates, and summaries.
   - Link each post to a dedicated page.

4. **About Page (`about.js`):** 

   - Add a section for your bio, skills, and interests.

5. **Post Page (`[slug].js`):** 

   - Use dynamic routing for individual blog posts.
   - Fetch markdown files for content stored in a `content/posts` directory.

### Components

1. **Header:** 

   - Add navigation links for Home, Work, Blog, and About.

2. **Footer:** 

   - Include your social media links and a copyright notice.

3. **Reusable Components:** 

   - Buttons, cards, and links.

## Step 3: Style the Website 

1. **Fonts:** 

   - Use a minimalist font like [Inter](https://rsms.me/inter/) or [Satoshi](https://satoshifont.com/).
   - Add it via [Google Fonts](https://fonts.google.com/) or import it locally:
     ```javascript
     import "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap";
     ```

2. **Colors:** 

   - Match the clean, monochromatic palette of wojtek.im.
   - Define the color scheme in `tailwind.config.js`:
     ```javascript
     theme: {
       extend: {
         colors: {
           primary: "#1a1a1a",
           secondary: "#3a3a3a",
           accent: "#f5f5f5",
           highlight: "#00bcd4",
         },
         fontFamily: {
           sans: ["Inter", "sans-serif"],
         },
       },
     },
     ```

3. **Layout and Components Styling:** 

   - Create a cohesive grid system using Tailwind utilities.
   - Add interactive effects:
     ```css
     .link {
       color: theme('colors.highlight');
       text-decoration: none;
       transition: color 0.3s;
     }

     .link:hover {
       color: theme('colors.accent');
     }

     .button {
       background-color: theme('colors.primary');
       color: theme('colors.accent');
       padding: 0.5rem 1rem;
       border-radius: 0.25rem;
       transition: transform 0.2s;
     }

     .button:hover {
       transform: scale(1.05);
     }
     ```

4. **Section Spacing:** 

   - Use consistent spacing with Tailwind:
     ```html
     <section class="py-16 px-8 max-w-4xl mx-auto">
       <!-- Section content -->
     </section>
     ```

## Step 4: Add Key Sections

### Contributions Chart

1. **Implementation:**
   - Use the GitHub API to fetch contribution data.
   - Install a charting library like `react-github-calendar`: `npm install react-github-calendar`.

2. **Code:**
   - Add a `ContributionsChart` component:
     ```javascript
     import GitHubCalendar from "react-github-calendar";

     const ContributionsChart = () => {
       return (
         <div className="py-16 px-8 max-w-4xl mx-auto">
           <h2 className="text-xl font-bold mb-4">My GitHub Contributions</h2>
           <GitHubCalendar username="your-github-username" />
         </div>
       );
     };

     export default ContributionsChart;
     ```

3. **Styling:**
   - Customize the calendar appearance by passing props or adding custom CSS to fit the site’s theme.

### Projects Section

1. **Implementation:**
   - Create a `content/projects` directory.
   - Add JSON or markdown files for each project:
     ```json
     [
       {
         "title": "Project One",
         "description": "A brief description of the project.",
         "link": "https://github.com/your-repo/project-one"
       },
       {
         "title": "Project Two",
         "description": "Another project description.",
         "link": "https://yourwebsite.com/project-two"
       }
     ]
     ```

2. **Code:**
   - Create a `Projects` component:
     ```javascript
     import projects from "../content/projects/projects.json";

     const Projects = () => {
       return (
         <div className="py-16 px-8 max-w-4xl mx-auto">
           <h2 className="text-xl font-bold mb-4">Projects</h2>
           <ul>
             {projects.map((project, index) => (
               <li key={index} className="mb-4">
                 <a href={project.link} target="_blank" rel="noopener noreferrer" className="link">
                   <h3 className="text-lg font-semibold">{project.title}</h3>
                   <p>{project.description}</p>
                 </a>
               </li>
             ))}
           </ul>
         </div>
       );
     };

     export default Projects;
     ```

3. **Styling:**
   - Use a grid or list layout with hover effects for links.

### Newsletter

1. **Implementation:**
   - Use a service like [Mailchimp](https://mailchimp.com/) or [ConvertKit](https://convertkit.com/) for managing subscribers.

2. **Code:**
   - Add a `Newsletter` component:
     ```javascript
     const Newsletter = () => {
       return (
         <div className="py-16 px-8 max-w-4xl mx-auto bg-secondary rounded-lg">
           <h2 className="text-xl font-bold mb-4 text-accent">Subscribe to My Newsletter</h2>
           <form action="https://your-mailchimp-url" method="POST">
             <input
               type="email"
               name="EMAIL"
               placeholder="Your email address"
               required
               className="p-2 rounded w-full mb-4"
             />
             <button type="submit" className="button">
               Subscribe
             </button>
           </form>
         </div>
       );
     };

     export default Newsletter;
     ```

3. **Styling:**
   - Use a rounded card-like layout with vibrant colors for the call-to-action.

## Step 5: Add Content with Markdown

1. **Set Up a Content Directory:**

   - Create a `content/posts` folder.
   - Add markdown files for each blog post (e.g., `content/posts/my-first-post.md`):
     ```markdown
     ---
     title: "My First Post"
     date: "2025-01-01"
     ---

     This is my first post on my personal website.
     ```

2. **Load Content:**

   - Install a markdown library: `npm install gray-matter`.
   - Use it in your `[slug].js` page to parse markdown:
     ```javascript
     import fs from 'fs';
     import path from 'path';
     import matter from 'gray-matter';

     export async function getStaticProps({ params }) {
       const filePath = path.join(process.cwd(), 'content/posts', `${params.slug}.md`);
       const fileContent = fs.readFileSync(filePath, 'utf-8');
       const { data, content } = matter(fileContent);

       return {
         props: { data, content },
       };
     }
     ```

## Step 6: Deploy the Website

1. **Choose a Hosting Platform:**

   - Use [Vercel](https://vercel.com/) for seamless Next.js deployment.

2. **Deploy the Site:**

   - Push your project to a Git repository (e.g., GitHub).
   - Link the repository to Vercel.
   - Vercel automatically builds and deploys your site.

3. **Set Up a Custom Domain:**

   - Register a domain with a provider like [Namecheap](https://www.namecheap.com/).
   - Configure the domain in Vercel's settings.

## Step 7: Test and Optimize

1. **Testing:**

   - Test on multiple devices and browsers.

2. **SEO:**

   - Add meta tags and optimize for search engines.

3. **Performance:**

   - Use [Lighthouse](https://developers.google.com/web/tools/lighthouse) to audit performance and accessibility.

4. **Analytics:**

   - Add Google Analytics or Plausible for tracking.

---

Follow these steps, and you'll have a polished, personal website closely resembling wojtek.im!
