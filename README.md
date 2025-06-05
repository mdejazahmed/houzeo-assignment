# User Management Application

A modern web application built with Vue 3, Vuetify 3, and Vue Router for managing user information with a clean, responsive interface.

## Features

- Add multiple users in a single form
- Form validation for all fields
- Responsive design that works on all devices
- File upload support (images and PDFs)
- Multi-select for languages and cities
- Clean and intuitive user interface

## Technologies Used

- Vue 3 - Progressive JavaScript Framework
- Vuetify 3 - Material Design Component Framework
- Vue Router - Official Router for Vue.js
- Vite - Next Generation Frontend Tooling
- Pinia (optional, if used) - State Management

## Project Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mdejazahmed/houzeo-assignment.git
   cd houzeo-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Compile and Hot-Reload for Development**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Compile and Minify for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build locally
- `lint` - Lint and fix files
- `typecheck` - Run TypeScript type checking

## Form Fields

- **Name** - User's full name
- **Email** - Valid email address
- **Mobile** - Phone number with formatting
- **Birth Date** - Date of birth
- **Gender** - Male/Female selection
- **City** - Multiple city selection
- **Languages** - Multiple language selection with icons
- **File** - Upload a file (JPEG/PNG/PDF)

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── layouts/         # Layout components
├── pages/           # Application views
├── router/          # Vue Router configuration
├── stores/          # State management
└── utils/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vuetify](https://vuetifyjs.com/) for the amazing UI components
- [Vue.js](https://vuejs.org/) for the reactive framework
- [Vite](https://vitejs.dev/) for the fast development experience
