Certify
Create personalized certificates in batches --- right in your browser.
Certify is a web-based certificate editor that lets you upload a certificate PDF, import recipient names from a CSV file, customize the name styling and placement, and export individual certificates together in a ZIP archive.
Features
Upload a certificate template --- use an existing PDF as the certificate background.
Import recipient names --- load names from a CSV file and remove duplicate names.
Manage recipients --- add, edit, select, and delete recipients.
Live certificate preview --- see the certificate while you make changes.
Customize text --- adjust the recipient name's font, size, bold styling, color, position, and rotation.
Add an image or signature --- upload an image and reposition it on the preview.
Batch PDF export --- generate a PDF for each imported recipient and download the files in a ZIP archive.
Browser-side processing --- certificate generation is implemented in the client using JavaScript PDF libraries.
Tech stack
Technology                                      Purpose
Next.js 16               React framework
React 19                  User interface
TypeScript   Type-safe application code
Tailwind CSS        Styling
jsPDF      PDF generation
pdf-lib              Reading and editing PDF documents
PDF.js     Rendering PDF templates for preview
fflate   Creating ZIP archives
Lucide                   Icons
Getting started
Prerequisites
Node.js compatible with your installed Next.js version
pnpm (the project declares pnpm as its package manager)
Installation
Clone the repository:
git clone https://github.com/ioarunkumar/certify.git
cd certify
Install dependencies:
pnpm install
Start the development server:
pnpm dev
Open http://localhost:3000 in your browser.
Production build
Build the application:
pnpm build
Run the production server locally:
pnpm start
How to use
Open Certify in your browser.
Select Upload certificate PDF to load your certificate template. If you don't upload one, the app displays its built-in sample design.
Select Upload names CSV and choose a CSV containing recipient names. A header named Name is supported.
Select a recipient to preview their certificate, or add and edit recipients manually.
Customize the name's font, size, weight, color, position, and rotation.
Upload an image or signature if needed, then drag it on the preview to position it.
Select Export PDF to generate PDFs for imported recipients and download them as a ZIP file.
Example CSV
Save the following as recipients.csv:
Name
Aarav Sharma
Priya Verma
Rahul Singh
The CSV importer reads the first column and removes duplicate names (case-insensitive). Use a simple one-column CSV for the most predictable results.
Project structure
certify/
├── app/                 # Next.js app routes and styles
├── components/
│   └── ui/              # Reusable UI components
├── lib/                 # Shared utilities
├── public/              # Static assets
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
└── tsconfig.json
Notes and limitations
The current CSV importer is designed for a simple list of names. It reads the first comma-separated field from each line; complex CSV files with quoted commas or multi-column data may not parse as expected.
The demo recipient shown in the initial preview is excluded from the exported batch. Import a CSV or add real recipients to generate certificates.
The current export flow generates certificates in the browser, so large batches may take longer and use more memory.
The Save control currently changes the interface's saved status; it does not implement persistent project storage.
Check the output PDFs before distributing them, especially when using custom templates, unusual page sizes, or uploaded images.
Contributing
Contributions and suggestions are welcome.
Fork the repository.
Create a branch for your change.
Make and test your changes.
Open a pull request with a clear description of what changed.
For bugs or feature requests, please open an issue.
License
No license is currently specified in this repository. Unless a license is added, the default copyright rules apply and reuse may be restricted.
Built by Arun Kumar.
