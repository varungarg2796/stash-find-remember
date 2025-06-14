
# 🗂️ Stasher - Organize Your Belongings with Ease

![Stasher Logo](public/stasher-logo.svg)

A modern, intuitive web application for managing and organizing your personal belongings. Track items, organize them into collections, and never lose track of your possessions again.

## ✨ Features

### 📋 Item Management
- **Add Items**: Create detailed records of your belongings with photos, descriptions, locations, and tags
- **Search & Filter**: Quickly find items using powerful search and filtering capabilities
- **Quantity Tracking**: Monitor quantities and get notified when items are running low
- **Item Actions**: Use, gift, or archive items with automatic history tracking
- **Bulk Import**: Import multiple items at once using CSV or manual entry

### 📁 Collections
- **Create Collections**: Organize related items into themed collections
- **Drag & Drop**: Easily reorganize items within collections
- **Share Collections**: Generate shareable links for collections with privacy controls
- **Collection Types**: Support for different collection types (boxes, rooms, categories, etc.)

### 🔍 Smart Features
- **AI Assistant**: Ask Stasher questions about your items using natural language
- **Visual Search**: Upload images to find similar items in your stash
- **Location Tracking**: Keep track of where items are stored
- **Tag System**: Categorize items with customizable tags
- **History Tracking**: Complete audit trail of all item actions

### 📊 Analytics & Insights
- **Dashboard Stats**: View comprehensive statistics about your belongings
- **Usage Patterns**: Track how often you use different items
- **Value Tracking**: Monitor the total value of your possessions
- **Archive Management**: Review and restore archived items

### 👤 User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: Choose your preferred visual theme
- **Customizable Preferences**: Personalize locations, tags, and settings
- **User Profiles**: Manage your account and preferences

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd stasher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components

### State Management
- **TanStack Query** - Server state management and caching
- **React Context** - Client state management
- **React Router** - Client-side routing

### UI/UX
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **React Hook Form** - Form handling with validation

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── form/           # Form-specific components
│   ├── item/           # Item-related components
│   └── collection/     # Collection-related components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and external services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Library configurations
```

## 🎯 Usage Guide

### Getting Started
1. **Login**: Use the login button to create your account
2. **Add Your First Item**: Click "Add Item" to create your first inventory entry
3. **Organize**: Create collections to group related items
4. **Track**: Use the search and filter features to find items quickly

### Adding Items
- Fill in item details (name, description, quantity, location)
- Upload photos for visual identification
- Add tags for better categorization
- Set purchase information for value tracking

### Managing Collections
- Create themed collections (e.g., "Kitchen Appliances", "Winter Clothes")
- Drag and drop items between collections
- Share collections with family or friends
- Set privacy levels for each collection

### Using the Search
- Use the search bar to find items by name or description
- Filter by location, tags, or quantity
- Use the AI assistant for natural language queries

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add any environment variables here
VITE_API_URL=your_api_url_here
```

### Customization
- **Locations**: Add your custom storage locations in user preferences
- **Tags**: Create custom tags for better organization
- **Currency**: Set your preferred currency for price tracking

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful component and variable names
- Write responsive, mobile-first CSS
- Test your changes across different screen sizes
- Follow the existing code style and conventions

## 📱 Mobile Support

Stasher is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Swipe gestures for navigation
- Mobile-optimized forms and dialogs
- Responsive image handling
- Fast loading on mobile networks

## 🔒 Privacy & Security

- **Local Storage**: Data is stored locally in your browser
- **No External Tracking**: Your personal information stays private
- **Secure Sharing**: Collection sharing uses secure, time-limited links
- **Data Export**: Export your data anytime in standard formats

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Lovable
1. Click the "Publish" button in the Lovable editor
2. Your app will be available at `yourapp.lovable.app`

### Custom Domain
Connect your own domain through Project Settings > Domains in Lovable.

### Self-Hosting
After connecting to GitHub, you can deploy the built application to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 📊 Analytics & Monitoring

The app includes built-in analytics for:
- Item usage patterns
- Collection organization trends
- Search behavior
- Performance metrics

## 🔄 Data Management

### Backup & Restore
- Export your data as JSON or CSV
- Import data from other inventory systems
- Automatic browser storage backup

### Data Migration
- Bulk import from spreadsheets
- API endpoints for data synchronization
- Cross-platform data compatibility

## 🐛 Troubleshooting

### Common Issues

**App not loading**
- Clear browser cache and cookies
- Check if JavaScript is enabled
- Try in an incognito/private browser window

**Images not uploading**
- Check file size (max 10MB)
- Ensure file format is supported (JPG, PNG, WebP)
- Check browser permissions for file access

**Search not working**
- Try clearing and retyping your search query
- Check if items exist with the search terms
- Use tags or filters as alternative search methods

### Performance Optimization
- Use image compression for faster loading
- Regularly archive unused items
- Limit collections to manageable sizes

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤔 Support

- **Documentation**: Check this README and inline help text
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions on GitHub
- **Updates**: Follow the project for new features and improvements

## 🎉 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered web development
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Inspired by modern inventory management needs

---

**Made with ❤️ using Lovable AI Editor**

*Stasher - Because knowing where your stuff is should be simple.*
