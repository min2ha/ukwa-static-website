# UK Web Archive - Static Website

A multilingual static website built with Hugo for the UK Web Archive, supporting English, Welsh (Cymraeg), and Scottish Gaelic (Gàidhlig).

## Features

- **Multilingual Support**: Full content in English, Welsh, and Scottish Gaelic
- **Responsive Design**: Mobile-first, institutional style inspired by British Library and BBC
- **Hugo-Powered**: Fast, modern static site generator
- **Docker Support**: Local development with Docker Compose
- **CI/CD Ready**: Azure Pipelines and GitHub Actions workflows included
- **Accessible**: WCAG compliant with semantic HTML
- **SEO Optimized**: Proper meta tags and structured content

## Quick Start

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.111.3 or later
- [Docker](https://www.docker.com/get-started) and Docker Compose (optional, for containerized development)
- [Git](https://git-scm.com/)

### Local Development

#### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/ukwa/ukwa-static-website.git
cd ukwa-static-website

# Start the development server
docker-compose up

# Access the site at http://localhost:1313
```

#### Option 2: Using Hugo Directly

```bash
# Clone the repository
git clone https://github.com/ukwa/ukwa-static-website.git
cd ukwa-static-website

# Start the Hugo development server
hugo server -D

# Access the site at http://localhost:1313
```

### Building for Production

```bash
# Build the site
hugo --minify

# Output will be in the ./public directory
```

## Project Structure

```
ukwa-static-website/
├── content/              # Markdown content files
│   ├── _index.md        # English home page
│   ├── about/           # About page
│   ├── contact/         # Contact page
│   ├── save-website/    # Save website page
│   ├── cy/              # Welsh content
│   └── gd/              # Scottish Gaelic content
├── layouts/             # Hugo templates
│   ├── _default/        # Default templates
│   │   ├── baseof.html  # Base template
│   │   ├── list.html    # List template
│   │   └── single.html  # Single page template
│   └── partials/        # Partial templates
│       ├── header.html  # Header with navigation
│       └── footer.html  # Footer
├── static/              # Static assets
│   └── css/
│       └── style.css    # Main stylesheet
├── docs/                # Documentation
│   ├── azure-architecture.md  # Azure deployment architecture
│   └── git-workflow.md        # Git workflow guide
├── hugo.toml            # Hugo configuration
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Production Docker image
├── azure-pipelines.yml  # Azure Pipelines CI/CD
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions workflow
```

## Languages

The website supports three languages:

| Language | Code | URL Pattern |
|----------|------|-------------|
| English | en | `/` |
| Welsh (Cymraeg) | cy | `/cy/` |
| Scottish Gaelic (Gàidhlig) | gd | `/gd/` |

### Adding Content

Create content in the appropriate language directory:

```bash
# English content
content/new-page/_index.md

# Welsh content
content/cy/new-page/_index.md

# Scottish Gaelic content
content/gd/new-page/_index.md
```

## Configuration

The main configuration is in `hugo.toml`. Key settings:

```toml
baseURL = 'https://ukwa.example.org/'
title = 'UK Web Archive'
defaultContentLanguage = 'en'
```

### Customizing the Site

- **Logo/Title**: Edit `layouts/partials/header.html`
- **Styles**: Modify `static/css/style.css`
- **Navigation**: Configure in `hugo.toml` under `[languages.*.menu.main]`
- **Footer**: Edit `layouts/partials/footer.html`

## Deployment

### Azure Deployment

#### Prerequisites

1. Azure subscription
2. Azure Storage Account with static website hosting enabled
3. Azure CDN (optional, for better performance)

#### Using Azure Pipelines

1. Configure service connections in Azure DevOps
2. Update `azure-pipelines.yml` with your storage account names
3. Push to `development` or `main` branch to trigger deployment

```bash
git checkout development
git add .
git commit -m "Deploy to development"
git push origin development
```

#### Using GitHub Actions

1. Set up GitHub secrets:
   - `AZURE_CREDENTIALS_DEV`
   - `AZURE_CREDENTIALS_PROD`
   - `AZURE_STORAGE_ACCOUNT_DEV`
   - `AZURE_STORAGE_ACCOUNT_PROD`

2. Push to trigger deployment:

```bash
git push origin development  # Deploy to dev
git push origin main         # Deploy to production
```

### Manual Azure Deployment

```bash
# Build the site
hugo --minify

# Upload to Azure Storage
az storage blob upload-batch \
  --account-name <storage-account-name> \
  --destination '$web' \
  --source public/ \
  --overwrite
```

### Docker Production Deployment

```bash
# Build the Docker image
docker build -t ukwa-static:latest .

# Run the container
docker run -d -p 80:80 ukwa-static:latest
```

## Development Workflow

See [docs/git-workflow.md](docs/git-workflow.md) for detailed Git workflow documentation.

### Branch Strategy

- `main` - Production branch
- `development` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Emergency fix branches

### Making Changes

```bash
# Create a feature branch
git checkout development
git pull origin development
git checkout -b feature/my-feature

# Make your changes
# Test locally with docker-compose up

# Commit and push
git add .
git commit -m "Add my feature"
git push origin feature/my-feature

# Create a pull request to development
```

## Azure Architecture

The project includes detailed architecture diagrams for Azure deployment:

- **Free Tier**: Using Azure Static Web Apps
- **Paid Tier**: Using Azure Blob Storage + CDN + Front Door
- **Enterprise**: Multi-region deployment

See [docs/azure-architecture.md](docs/azure-architecture.md) for details.

## Styling

The website uses a formal institutional design inspired by:

- The British Library
- BBC official websites

### Color Scheme

- **Primary Blue**: `#003087` - Logo, headings, navigation
- **Secondary Blue**: `#0055A5` - Accents, links
- **Text Blue**: `#003366` - Body text
- **White Background**: `#FFFFFF`

### Fonts

- Sans-serif: 'Helvetica Neue', Arial, sans-serif
- Designed for readability and accessibility

## Accessibility

The website is designed to meet WCAG 2.1 Level AA standards:

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Sufficient color contrast
- Responsive design

## Performance

Optimization features:

- Minified HTML, CSS, and JavaScript
- Optimized images
- CDN delivery
- Browser caching
- Gzip compression

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

### Local Testing

```bash
# Start development server
docker-compose up

# In another terminal, run link checker
docker run --rm -it --network host ghcr.io/linkchecker/linkchecker:latest http://localhost:1313

# HTML validation
docker run --rm -v $(pwd)/public:/public ghcr.io/validator/validator:latest vnu /public
```

### CI Testing

Automated tests run on every pull request:

- Hugo build verification
- Link checking
- HTML validation
- Accessibility checks

## Troubleshooting

### Common Issues

**Hugo not found**
```bash
# Install Hugo Extended
brew install hugo  # macOS
# or download from https://gohugo.io/installation/
```

**Port 1313 already in use**
```bash
# Find and kill the process
lsof -ti:1313 | xargs kill
```

**Docker build fails**
```bash
# Clear Docker cache
docker-compose down
docker system prune -a
docker-compose up --build
```

**Content not updating**
```bash
# Clear Hugo cache
rm -rf resources/ public/
hugo server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

See [docs/git-workflow.md](docs/git-workflow.md) for detailed contribution guidelines.

## Documentation

- [Azure Architecture](docs/azure-architecture.md) - Deployment architecture diagrams
- [Git Workflow](docs/git-workflow.md) - Development and deployment workflow
- [Hugo Documentation](https://gohugo.io/documentation/) - Official Hugo docs

## Support

For issues, questions, or suggestions:

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/ukwa/ukwa-static-website/issues)
- **Email**: dev-team@ukwa.example.org
- **Documentation**: See `/docs` directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Hugo](https://gohugo.io/)
- Styled with inspiration from The British Library and BBC
- Deployed on [Microsoft Azure](https://azure.microsoft.com/)

---

**UK Web Archive** - Preserving the UK Web for future generations
