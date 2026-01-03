# 🔥 Streak Tracker - Habit Tracking with 3D Animations

A beautiful, modern habit tracking web application with 3D animations, gamification, and an engaging user experience.

## ✨ Features

- **📊 Habit Tracking**: Track multiple daily habits with ease
- **🎨 3D Animations**: Beautiful Three.js powered 3D background and reward animations
- **🎮 Gamification**: Earn XP, level up, unlock achievements
- **🔥 Streak System**: Build and maintain streaks for each habit
- **📅 Heatmap Calendar**: GitHub-style contribution calendar showing your progress
- **🏆 Rewards**: Confetti, trophies, and star animations when completing tasks
- **💾 Local Storage**: All data saved locally in your browser
- **📱 Responsive**: Works perfectly on desktop and mobile devices
- **🌙 Dark Theme**: Beautiful dark theme with glassmorphism effects

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: React Three Fiber & Three.js
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy with one click!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## 🎯 Default Habits

The app comes with 6 pre-configured habits:
- 💪 Morning Workout
- 🌅 Early Wake Up
- 🚶 Morning Walk
- 📚 Daily Reading
- 💻 Code Practice
- 📝 Gratitude Journal

You can customize these in the code to fit your personal goals!

## 📊 Stats & Gamification

- **Level System**: Gain 10 XP per day of streak, level up every 100 XP
- **Achievements**: Unlock achievements every 500 total XP
- **Best Streak**: Track your longest streak for each habit
- **Completion Rate**: See how many habits you've completed today

## 🎨 Customization

### Adding New Habits

Edit `src/store/habitStore.ts` to add your custom habits:

```typescript
{
  id: "7",
  name: "Your Habit Name",
  icon: "🎯",
  color: "from-blue-500 to-cyan-500",
  streak: 0,
  bestStreak: 0,
  completedDates: [],
  lastCompleted: null,
  isCompletedToday: false,
}
```

### Changing Colors & Theme

Modify `tailwind.config.ts` and `src/app/globals.css` to customize the theme.

## 📱 Progressive Web App

To make this a PWA that can be installed on your device, add PWA configuration (coming soon).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🌟 Motivation

Stay consistent, build better habits, and watch your progress grow! 🚀

---

Made with ❤️ and ☕ for building better habits
