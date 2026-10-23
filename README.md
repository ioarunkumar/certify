<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-certifyfaster.vercel.app-000000?style=for-the-badge)](https://certifyfaster.vercel.app/)

# 🎓 Certify

### Create personalized certificates in batches, right in your browser.

Upload a PDF template, import names from a CSV, style and place the text, and export every certificate as a ZIP, with no server and no sign-up.

<br />

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

[Demo](https://certifyfaster.vercel.app/) · [Features](#-features) · [Quick Start](#-quick-start) · [How It Works](#-how-it-works) · [Report a Bug](https://github.com/ioarunkumar/certify/issues)

</div>

---

## ✨ Features

<table>
  <tr>
    <td width="50%" valign="top">

### 📄 Bring Your Own Template
Use any existing PDF as the certificate background. No template? The built-in sample design is ready to go.

    </td>
    <td width="50%" valign="top">

### 📥 Smart CSV Import
Load recipient names from a CSV file. Duplicates are removed automatically, ignoring case.

    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">

### 👥 Recipient Management
Add, edit, select, and delete recipients without leaving the editor.

    </td>
    <td width="50%" valign="top">

### 👀 Live Preview
Every change appears instantly on the certificate preview.

    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">

### 🎨 Full Text Control
Adjust the name's font, size, bold styling, color, position, and rotation.

    </td>
    <td width="50%" valign="top">

### ✍️ Signature & Images
Upload an image or signature and drag it into place on the preview.

    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">

### 📦 Batch Export
Generate one PDF per recipient and download them all in a single ZIP archive.

    </td>
    <td width="50%" valign="top">

### 🔒 Browser-Side Processing
Certificates are generated in the client with JavaScript PDF libraries.

    </td>
  </tr>
</table>

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/-Next.js_16-000?logo=nextdotjs&logoColor=white) | React framework |
| **UI** | ![React](https://img.shields.io/badge/-React_19-20232A?logo=react&logoColor=61DAFB) | User interface |
| **Language** | ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) | Type-safe application code |
| **Styling** | ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) | Utility-first styling |
| **PDF Generation** | `jsPDF` | Building certificate PDFs |
| **PDF Editing** | `pdf-lib` | Reading and editing PDF documents |
| **PDF Rendering** | `PDF.js` | Rendering PDF templates for preview |
| **Archiving** | `fflate` | Creating ZIP archives |
| **Icons** | `Lucide` | Icon set |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** compatible with your installed Next.js version
- **[pnpm](https://pnpm.io/)** (the project declares pnpm as its package manager)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ioarunkumar/certify.git
cd certify

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build

```bash
# Build the application
pnpm build

# Run the production server locally
pnpm start
```

---

## 🧭 How It Works

| Step | Action | What Happens |
| :---: | :--- | :--- |
| **1** | 📄 **Upload certificate PDF** | Loads your template. Skip it to use the built-in sample design. |
| **2** | 📥 **Upload names CSV** | Imports recipients. A header named `Name` is supported. |
| **3** | 👤 **Select a recipient** | Preview their certificate, or add and edit recipients manually. |
| **4** | 🎨 **Customize the name** | Set font, size, weight, color, position, and rotation. |
| **5** | ✍️ **Add a signature** | Upload an image, then drag it to position it on the preview. |
| **6** | 📦 **Export PDF** | Generates a PDF for each imported recipient and downloads a ZIP. |

<details>
<summary><b>📋 Example CSV</b> (click to expand)</summary>

<br />

Save the following as `recipients.csv`:

```csv
Name
Aarav Sharma
Priya Verma
Rahul Singh
```

> [!TIP]
> The importer reads the **first column** and removes duplicate names (case-insensitive). A simple one-column CSV gives the most predictable results.

</details>

<details>
<summary><b>🗂️ Project Structure</b> (click to expand)</summary>

<br />

```text
certify/
├── app/                # Next.js app routes and styles
├── components/
│   └── ui/             # Reusable UI components
├── lib/                # Shared utilities
├── public/             # Static assets
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
└── tsconfig.json
```

</details>

---

## ⚠️ Notes & Limitations

> [!NOTE]
> The demo recipient shown in the initial preview is **excluded** from the exported batch. Import a CSV or add real recipients to generate certificates.

> [!WARNING]
> **CSV parsing is basic.** The importer reads the first comma-separated field from each line, so files with quoted commas or multiple columns may not parse as expected.

> [!WARNING]
> **Large batches use more memory.** Export runs entirely in the browser, so big batches may take longer.

> [!IMPORTANT]
> Always **check the output PDFs** before distributing them, especially when using custom templates, unusual page sizes, or uploaded images.

- The **Save** control only changes the interface's saved status. It does not implement persistent project storage.

---

## 🤝 Contributing

Contributions and suggestions are welcome!

1. 🍴 **Fork** the repository
2. 🌿 **Create a branch** for your change
3. 🛠️ **Make and test** your changes
4. 📬 **Open a pull request** with a clear description of what changed

Found a bug or have an idea? **[Open an issue](https://github.com/ioarunkumar/certify/issues)**.

---

## 📜 License

No license is currently specified in this repository. Unless a license is added, the default copyright rules apply and reuse may be restricted.

---

<div align="center">

**Built with ❤️ by [Arun Kumar](https://github.com/ioarunkumar)**

⭐ If Certify saved you time, consider giving it a star!

</div>
