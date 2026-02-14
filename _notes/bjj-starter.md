
#BJJ Architecture Deck

Brief Cursor: Give it the folder structure and the .cursorrules.
(read down for artifacts.)

Setup Python: Have it create process_video.py and requirements.txt. 

Set API Key: Ask Cursor, "How do I securely add my Google Gemini API key to this project?"

Design: Ask Cursor to "Build the Next.js pages based on the README.md and .cursorrules."

Agentic CMS for BJJ Video Blog
Conversation with Gemini
You said
i've been learning brazilian jujitsu from a master with one other student and filming the sessions for us to study in between. i'd like to turn this into an easy to update (if not automatic) blog-style web site. I have the videos in a folder, and I have been working on an assistant editor agent to go through the footage to find the best moments and make short videos, which will be the main content. I'd love it if there was some kind of smart cloud agent that could understand the videos, (or the documentation from my editor agent) and then enhance each post with some basic documentation including the moves being studied, their proper names and short description, then something like a sequential diagram showing the key positional adjustments required to execute the move properly.

Gemini said
This is a fantastic use case for an "Agentic CMS" architecture. Since you are already building an assistant editor to handle the heavy lifting of video processing, you are about 70% of the way there.

To bridge the gap between "raw clips" and a "documented BJJ library," you can build a pipeline that treats your video metadata as the source of truth.

1. The Architecture: "The BJJ Knowledge Graph"
Instead of a traditional blog where you manually type posts, think of this as a headless pipeline.

The Trigger: Your editor agent finishes a "Best Moment" clip and drops it into a specific S3 bucket or Google Drive folder.

The Brain (Cloud Agent): A secondary agent (using a multimodal model like Gemini 1.5 Pro) watches the clip.

The Output: The agent generates a JSON file containing the move name, description, and "Key Frames" timestamps.

The Frontend: A simple Next.js or Astro site that consumes this JSON and renders the post automatically.

2. Generating the "Sequential Diagrams"
Creating actual illustrations is hard to automate, but you can simulate "Sequential Diagrams" using automated frame extraction:

Step-by-Step Breakdown: Prompt your agent to identify 3–5 "Critical Success Factors" (e.g., The Grip, The Hip Escape, The Transition, The Finish).

Timestamp Extraction: Have the agent return the exact millisecond where each phase occurs.

Visual Strip: Use ffmpeg to pull those high-res frames. On your website, display these in a horizontal scroll or a grid.

Result: A clean, high-fidelity visual breakdown of the move without you having to take screenshots.

3. The Tech Stack Recommendation
Since you’re already comfortable with LLMs and web apps, I’d suggest this flow:

Component	Technology	Why?
Video Intelligence	Gemini 1.5 Pro (API)	Its massive context window allows it to "watch" long sessions and accurately identify niche BJJ terminology.
Site Framework	Astro or Next.js	Great for "content-heavy" sites; can be set to "revalidate" whenever a new video is uploaded.
Hosting	Vercel or DigitalOcean	Since you already use these, they offer easy CI/CD for your web agent's output.
Database	Supabase or Firebase	To store the move metadata (names, descriptions, and diagram steps).
4. Implementation Idea: The "Technical Doc" Prompt
To get that "Smart Cloud Agent" feel, your prompt to the multimodal model should look something like this:

"You are a Black Belt BJJ analyst. Analyze this video clip. 1. Identify the primary technique (e.g., De la Riva Sweep). 2. Provide the official Portuguese and English names. 3. Identify 4 key timestamps representing the setup, the leverage point, the execution, and the stabilization. 4. Describe the weight distribution required for each."

To build this "Cloud Agent" script, we can use the Gemini 1.5 Pro API, which is uniquely suited for this because of its native multimodal capabilities—it can "watch" a video file directly without needing you to extract frames manually first.

Here is a Python blueprint that takes your edited video, analyzes the BJJ technique, and outputs a structured JSON object ready for your blog.

The "BJJ Analyst" Script
Python
import google.generativeai as genai
import time
import json

# Setup API Key (Uses your Google AI Pro credentials)
genai.configure(api_key="YOUR_GEMINI_API_KEY")

def analyze_bjj_footage(video_path):
    # 1. Upload the video to the Gemini API
    print(f"Uploading {video_path}...")
    video_file = genai.upload_file(path=video_path)

    # 2. Wait for the video to be processed by the cloud agent
    while video_file.state.name == "PROCESSING":
        time.sleep(2)
        video_file = genai.get_file(video_file.name)

    # 3. Initialize the Multimodal Model
    model = genai.GenerativeModel(model_name="gemini-1.5-pro")

    # 4. The "Black Belt" Prompt
    prompt = """
    Analyze this BJJ sparring/drilling clip. 
    Return a JSON object with the following structure:
    {
      "technique_name": "Common English Name",
      "portuguese_name": "Official name (if applicable)",
      "description": "A 2-3 sentence technical overview.",
      "difficulty": "Beginner/Intermediate/Advanced",
      "sequential_diagram_steps": [
        {"timestamp": "00:05", "label": "The Grip", "detail": "Establishing the collar and sleeve control."},
        {"timestamp": "00:08", "label": "The Off-balance", "detail": "Using the hip heist to load their weight."},
        {"timestamp": "00:12", "label": "The Sweep", "detail": "Kicking the primary leg while pulling the sleeve."},
        {"timestamp": "00:15", "label": "The Transition", "detail": "Coming up into technical mount."}
      ]
    }
    Only return the JSON.
    """

    # 5. Generate Content
    response = model.generate_content([video_file, prompt])
    
    # Clean up the markdown formatting if the model adds it
    json_data = response.text.replace('```json', '').replace('```', '').strip()
    return json.loads(json_data)

# Example Usage
# metadata = analyze_bjj_footage("path/to/your/clip.mp4")
# print(metadata)
How this integrates with your Blog
Automated Thumbnails: You can use the timestamp values from the JSON output to run a quick ffmpeg command that grabs high-res screenshots. These become your "Sequential Diagram" images.

Metadata Storage: Since you use Vercel or DigitalOcean, you can have this script push the resulting JSON and video to a bucket (like S3). Your Next.js site then just reads from that bucket to build the pages.

The "Diagram" UI: On your frontend, you can create a component that maps over the sequential_diagram_steps. When a user hovers over a step, it can jump the video player to that exact timestamp.

Here is the complete blueprint to build your BJJ Video Journal.

1. The "System Instruction" for your AI IDE
Copy and paste this into your AI IDE's (Cursor) Project Rules or .cursorrules file. This ensures your local agent understands the specific architecture we are building.

Role: Senior Full-Stack Developer & BJJ Expert. Project Goal: Build an automated blog from BJJ training videos. Tech Stack: Next.js (Frontend), Tailwind CSS (Styling), Gemini 1.5 Pro API (Analysis), FFmpeg (Frame extraction). Core Principle: Every video upload must result in a structured post with a technique name, Portuguese name, description, and "Sequential Diagram" (timestamped frames). Tone: Technical, clean, and highly organized.

2. The Project Folder Structure
Ask your AI IDE to "Create the following folder structure for my BJJ Blog project":

/src/app/ (Next.js App Router pages)

/src/components/ (UI components like the VideoPlayer and StepDiagram)

/src/scripts/ (The Python "Agent" script that processes videos)

/public/videos/ (Where you drop your edited clips)

/public/frames/ (Where the agent will save the "Sequential Diagram" images)

/content/data/ (Where the agent saves the JSON documentation for each post)

3. The "Cloud Agent" Processing Script
This is the file you’ll run (or ask your IDE to run) whenever you have a new video. Create a file named src/scripts/process_video.py.

Python
import google.generativeai as genai
import subprocess
import json
import os
import sys

# Replace with your API Key
genai.configure(api_key="YOUR_GEMINI_API_KEY")

def process_bjj_session(video_filename):
    video_path = f"public/videos/{video_filename}"
    video_id = video_filename.split('.')[0]
    
    # 1. Upload & Analyze
    model = genai.GenerativeModel("gemini-1.5-pro")
    video_file = genai.upload_file(path=video_path)
    
    prompt = """
    Identify the BJJ technique in this video. 
    Provide: English name, Portuguese name, 3-sentence description.
    Identify exactly 4 timestamps (format SS) for: 1. Setup, 2. Connection, 3. Execution, 4. Finish.
    Return ONLY valid JSON.
    """
    
    response = model.generate_content([video_file, prompt])
    data = json.loads(response.text.replace('```json', '').replace('```', ''))
    
    # 2. Extract Frames for the Sequential Diagram
    os.makedirs(f"public/frames/{video_id}", exist_ok=True)
    for i, step in enumerate(data['steps']):
        ts = step['timestamp']
        output_path = f"public/frames/{video_id}/step_{i}.jpg"
        subprocess.run(['ffmpeg', '-ss', str(ts), '-i', video_path, '-frames:v', '1', output_path])
        step['image_path'] = f"/frames/{video_id}/step_{i}.jpg"

    # 3. Save as Website Data
    with open(f"content/data/{video_id}.json", "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    process_bjj_session(sys.argv[1])
4. The Sequential Diagram UI (Design Document)
This is the visual core of your site. I’ve designed it to look like a high-end instructional platform. Drop this prompt into your AI IDE to generate the frontend:

Prompt for Cursor:

"Create a React component called TechniqueBreakdown. It should feature a large video player on top. Below the video, create a 'Sequential Diagram' section using a 4-column grid. Each column should show a frame image extracted by the agent. When a user clicks an image, the video player should seek to that specific timestamp. Use a dark, 'gym-style' aesthetic with Slate-900 backgrounds and Blue-500 accents."

5. Automation Strategy (No-Code/Low-Code)
To make this "automatic" without being a developer:

Drop your video into the /public/videos folder.

Open Cursor's Terminal and type: python src/scripts/process_video.py your_video_name.mp4.

The Agent will watch it, write the documentation, and pull the photos.

The Website will live-update with the new post.

To make this truly "automatic," we need to ensure that when you drop a video into your project and push it to GitHub, Vercel knows exactly how to handle the Python processing and the web build simultaneously.

Here is the complete deployment setup and the "Manual" for your AI IDE to handle the rest.

1. The Deployment Config (vercel.json)
Create this file in your root directory. It tells Vercel to install both Node.js (for the site) and Python (for your BJJ Agent).

JSON
{
  "functions": {
    "api/process.py": {
      "runtime": "vercel-python@0.0.1"
    }
  },
  "installCommand": "pip install -r requirements.txt && npm install",
  "buildCommand": "python src/scripts/process_all.py && next build"
}
2. The Build Script (src/scripts/process_all.py)
This script acts as the "Glue." When Vercel builds your site, this script loops through any videos in your folder that haven't been documented yet and runs the Gemini analysis.

Python
import os
import subprocess

def build_library():
    video_dir = "public/videos"
    data_dir = "content/data"
    
    # Get all videos
    videos = [f for f in os.listdir(video_dir) if f.endswith(('.mp4', '.mov'))]
    
    for video in videos:
        video_id = video.split('.')[0]
        # Only process if we don't already have the data
        if not os.path.exists(f"{data_dir}/{video_id}.json"):
            print(f"Agent is analyzing: {video}")
            subprocess.run(["python", "src/scripts/process_video.py", video])

if __name__ == "__main__":
    build_library()
3. The "System Instructions" for Cursor
Since you'll be using Cursor to build the actual pages, copy/paste this block into a chat with Cursor to generate the frontend instantly:

Developer Instruction: I need a "BJJ Library" index page and a dynamic "Technique" page.

Index Page: Scan the /content/data/*.json files and display them as a grid of cards. Each card should show the technique_name and a thumbnail from /public/frames/[id]/step_0.jpg.

Technique Page: Use the [id].json to populate the page. Use a large video player. Below it, create a "Step-by-Step" section.

Interactivity: When a user clicks a step image, the video must seekTo the timestamp provided in the JSON.

Styling: Use Tailwind CSS. Dark mode only. Make it look like a professional athletic training dashboard.

4. Your New Workflow (The "No-Code" Way)
Once this is set up, your interaction with the "tech" side is essentially zero. Here is your new routine:

Film/Edit: Save your short BJJ clip as armbar-from-guard.mp4.

Upload: Drag and drop that file into the /public/videos folder in Cursor.

Sync: Click "Commit and Push" in Cursor to send it to GitHub.

Wait: Vercel will automatically wake up the "Cloud Agent," which watches the video, writes the description, extracts the frames, and publishes the new page.

Final "Set-Up" Files
To ensure your AI IDE can run the Python code, you need a requirements.txt file. Create it and add these two lines:

Plaintext
google-generativeai
pathlib
Everything is now laid out for you. Would you like me to generate a "README.md" for your project that explains exactly how to troubleshoot if the Cloud Agent misidentifies a move?

Here is the README.md content. This is designed to be the "Instruction Manual" for your AI IDE (Cursor) and a guide for you to manage the content without touching code.

Drop this into a file named README.md in your project root.

🥋 BJJ Video Journal: AI-Automated Technical Library
This project is an automated pipeline that transforms raw BJJ training footage into a professional, documented technical library. It uses a Gemini 1.5 Pro Cloud Agent to "watch" the videos, identify techniques, and generate sequential diagrams.

🚀 The "Two-Step" Workflow
You don't need to write code to update the site. Just follow these two steps:

Drop Video: Place your edited .mp4 or .mov clips into the /public/videos/ folder.

Push to Web: Sync your changes to GitHub via Cursor. The build script will automatically trigger the AI Agent to document the new moves.

🛠 Troubleshooting: "The Agent Got it Wrong"
Sometimes the AI might misidentify a move (e.g., calling a "Kimura" an "Americana"). Since the site is "Data-Driven," you can fix this in seconds:

Find the Data: Go to the /content/data/ folder.

Open the JSON: Find the file named after your video (e.g., rolling-session-1.json).

Edit the Text: Manually change the technique_name or description.

Save & Push: Save the file and push to GitHub. The website will update instantly with your corrections.

🏗 System Architecture
Video Storage: /public/videos/

Visual Diagrams: /public/frames/[video-id]/ (Generated automatically via FFmpeg)

Knowledge Base: /content/data/ (JSON files containing the "brains" of each post)

Frontend: Next.js + Tailwind CSS (Optimized for mobile viewing at the gym)

🤖 Instructions for AI IDE (Cursor/Windsurf)
If you need to add features, paste this into the chat:

"Refer to the README.md. I want to add a [Feature Idea, e.g., 'Search bar' or 'Category tags']. Look at the JSON structure in /content/data and update the TechniqueBreakdown component to support this."

#project .cursorrules
# BJJ Video Journal Project Rules

## Role & Context
You are an expert Full-Stack Developer and a BJJ Black Belt. You are building a technical BJJ library for Jake Bernardsky. The goal is a "hands-off" pipeline where raw videos become documented technical posts.

## Project Structure
- `/public/videos`: Source of truth for .mp4/.mov clips.
- `/public/frames/[video-id]`: Extracted JPEG frames for sequential diagrams.
- `/content/data/[video-id].json`: Metadata (technique name, steps, timestamps) generated by Gemini.
- `/src/scripts`: Python logic for AI video analysis and FFmpeg extraction.

## Technical Requirements
- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React for icons.
- **AI Agent:** Use Gemini 1.5 Pro API for video understanding.
- **Sequential Diagrams:** These are NOT illustrations. They are 4 high-res frames extracted from the video at timestamps provided in the JSON.
- **Design Aesthetic:** Professional, high-contrast "Gym Dark Mode" (Slate-900/950 backgrounds, Blue-500/600 accents).

## Coding Principles
- **No-Code Management:** The user (Jake) is not a developer. Ensure the site builds automatically from the JSON data.
- **Interactivity:** On technique pages, clicking a step image MUST trigger the video player to seek to that timestamp.
- **Robustness:** If a video exists but a JSON file does not, the build should not crash; it should simply not display that post yet.

## Tone & Language
- Use correct BJJ terminology (e.g., "Guard Passing," "Sweep," "Submission," "De La Riva").
- Include Portuguese names for moves when available in the metadata.


Some content ideas:

diagrams: https://preview.redd.it/fivp1wpg2qw11.png?width=1080&crop=smart&auto=webp&s=b03632376bac3ae22ad9ba03d700ef4ddccc8ee2

https://bjj-world.com/wp-content/uploads/2020/04/c8a60e3d0b67f631ab63581a0abdfb34.jpg

https://www.elitesports.com/cdn/shop/articles/img-1718277785503_ca288c81-dd36-4c31-a826-0e94e3f0d8ea.png?v=1736540180&width=1400

https://www.jiujitsubrotherhood.com/cdn/shop/articles/4_Positions.png?v=1761386453

https://sensobjj.com/blogs/graciemag-1/travis-stevens-teaches-three-takedowns?srsltid=AfmBOoqod9xpxmbbXBNWWIT4wU07El0K7KiHP_xzWoV8-gAqGbGUaRPE

https://i.pinimg.com/1200x/84/1e/e6/841ee68a991ca64dd230c864b771223f.jpg
https://i.pinimg.com/474x/fe/9e/e7/fe9ee7bd8aec80dff06f4e753e8cc780.jpg
https://i.pinimg.com/1200x/d1/0d/17/d10d171006fd96b71d19267f4533f1f4.jpg
https://i.pinimg.com/1200x/e8/4a/13/e84a1395f037c04608318f36ea9fb822.jpg
https://i.pinimg.com/736x/99/ef/70/99ef70e445ec08a6a381c29fa4c1880c.jpg
https://i.pinimg.com/736x/da/6e/ab/da6eabb039e186630a56146049a0196b.jpg

Entire Pinterest board: https://www.pinterest.com/pin/1055599904157704/


Facebook group:
https://www.facebook.com/groups/733553463659020/posts/1588399234841101/


terms:
https://en.amersfoortbjj.nl/blog/2020/7/19/de-ultieme-woordenlijst-van-braziliaanse-jiu-jitsu-termen

Content:
https://en.amersfoortbjj.nl/blog
https://www.elitesports.com/blogs/news/effective-bjj-back-survival-techniques
https://bjj-world.com/brazilian-jiu-jitsu-submissions/
https://sensobjj.com/blogs/graciemag-1