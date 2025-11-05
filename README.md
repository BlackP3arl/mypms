# MyPMS - Beautiful Kanban Board Project Management App

A modern, feature-rich Kanban board application built with Next.js, TypeScript, and Tailwind CSS. Organize your tasks effortlessly with drag-and-drop functionality and AI-powered prompt generation for Claude Code.

## ✨ Features

### Core Functionality
- **Drag-and-Drop Task Management** - Smooth animations when dragging tasks between columns
- **3 Default Columns** - To Do, In Progress, and Completed (fully customizable)
- **Custom Columns** - Add unlimited columns with color coding
- **Task Management** - Create, edit, and delete tasks with titles and descriptions
- **Color-Coded Columns** - 8 color options for visual organization
- **Local Storage Persistence** - All data saved automatically (no auth required)

### AI Features
- **AI Prompt Generation** - Click the sparkles (✨) button on any task to generate a Claude Code prompt
- **Smart Prompt Creation** - Uses OpenAI to transform task titles into detailed implementation prompts
- **Copy to Clipboard** - Easily copy generated prompts to share with Claude Code
- **Loading States** - Visual feedback during prompt generation

## 🛠 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS v3
- **Drag & Drop**: @dnd-kit library
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: Anthropic API (Claude Opus 4.1)
- **State Management**: React Hooks + localStorage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Anthropic API key (get one at https://console.anthropic.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BlackP3arl/mypms.git
cd mypms
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> ⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

4. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your app.

## 💡 How to Use

### Managing Tasks
1. **Add Task**: Click "Add Task" button at the bottom of any column
2. **Edit Task**: Hover over a task and click the edit (pencil) icon
3. **Delete Task**: Hover over a task and click the delete (trash) icon
4. **Drag & Drop**: Click and drag any task to move it to another column
5. **Generate Prompt**: Hover over a task and click the sparkles (✨) button

### Managing Columns
1. **Add Column**: Click the "Add Column" button at the right side
2. **Edit Column**: Hover over the column header and click the edit icon
3. **Delete Column**: Hover over the column header and click the delete icon
4. **Change Color**: Click edit and select a new color from the palette

### Using AI Prompt Generation
1. Click the sparkles (✨) button on any task card
2. Wait for the AI to generate a Claude Code prompt (2-3 seconds)
3. Review the generated prompt in the modal
4. Click "Copy Prompt" to copy it to your clipboard
5. Paste the prompt into Claude Code to implement the feature

## 📁 Project Structure

```
mypms/
├── app/
│   ├── api/
│   │   └── generate-prompt/
│   │       └── route.ts          # OpenAI API endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── Board.tsx                 # Main board component
│   ├── Column.tsx                # Column component
│   ├── Card.tsx                  # Task card component
│   ├── TaskModal.tsx             # Task creation/edit modal
│   ├── ColumnModal.tsx           # Column creation/edit modal
│   └── PromptModal.tsx           # AI prompt display modal
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   ├── hooks.ts                  # Custom React hooks
│   └── utils.ts                  # Utility functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.local                    # Environment variables (don't commit)
```

## 🎨 Customization

### Adding More Colors
Edit `lib/utils.ts` and add colors to the `COLUMN_COLORS` array:
```typescript
export const COLUMN_COLORS = [
  'bg-slate-100',
  'bg-blue-100',
  // Add more colors here...
]
```

### Changing Default Columns
Edit `lib/hooks.ts` and modify `DEFAULT_COLUMNS`:
```typescript
const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100', order: 0 },
  // Customize as needed
]
```

### Customizing AI Prompt System Prompt
Edit `app/api/generate-prompt/route.ts` and modify the system message to change how prompts are generated.

## 🔒 Security Notes

- API keys are never exposed to the client - all OpenAI calls go through your Next.js API route
- All data is stored locally in browser localStorage - no backend database
- Input validation is performed on API routes
- `.env.local` is automatically excluded from git

## 📝 Building for Production

```bash
npm run build
npm start
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Task labels and tags
- [ ] Due dates and reminders
- [ ] Task comments and collaborations
- [ ] Export to CSV/PDF
- [ ] Dark mode
- [ ] Mobile app

---

Built with ❤️ and AI by Claude Code
