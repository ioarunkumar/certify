'use client'

import { useMemo, useRef, useState } from 'react'
import { jsPDF } from 'jspdf'
import { PDFDocument } from 'pdf-lib'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { zipSync } from 'fflate'
import { Check, Download, FileImage, FileText, ImagePlus, Info, Plus, RotateCcw, Save, Sparkles, Upload, UserRound, ZoomIn, ZoomOut, Maximize, X } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

type Recipient = { name: string; demo?: boolean }
type NameFont = 'Cinzel' | 'Great Vibes' | 'Georgia' | 'Arial'

const starterRecipients: Recipient[] = [
  { name: 'Amara Okafor', demo: true },
]

function safeName(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'recipient'
}

function getNameFontWeight(isBold: boolean) {
  return isBold ? 700 : 400
}

function certificateSvg(name: string, signature: boolean, image: string | null, position: { x: number; y: number }, templateImage: string | null = null, namePosition = { x: 707, y: 620 }, nameFont: NameFont = 'Georgia', nameSize = 58, isBold = true, nameColor = '#0f2d4a', rotation = 0) {
  const escaped = name.replace(/[<&>]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[char] ?? char)
  const fontWeight = getNameFontWeight(isBold)
  const imageMarkup = image ? `<image data-draggable="image" href="${image}" x="${position.x - 70}" y="${position.y - 70}" width="140" height="140" preserveAspectRatio="xMidYMid slice" style="cursor:move"/>` : ''
  const background = templateImage
    ? `<image href="${templateImage}" x="0" y="0" width="1414" height="1000" preserveAspectRatio="none"/>`
    : `<defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fffefa"/><stop offset="1" stop-color="#faf7ef"/></linearGradient><linearGradient id="corner" x2="1" y2="1"><stop stop-color="#092947"/><stop offset=".55" stop-color="#123d63"/><stop offset=".57" stop-color="#d7a631"/><stop offset=".61" stop-color="#f2cb63"/><stop offset=".64" stop-color="#fff2c1"/></linearGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values=".12 0 0 0 .85 .12 0 0 0 .83 .12 0 0 0 .77 0 0 0 .06 0"/></filter></defs><rect width="1414" height="1000" fill="url(#paper)"/><rect width="1414" height="1000" filter="url(#grain)" opacity=".18"/><path d="M0 0h355L205 42 84 111 0 213zM1414 1000h-358l149-42 125-69 84-102z" fill="url(#corner)"/><path d="M0 197C53 91 176 37 315 0M1414 803c-53 106-176 160-315 197" fill="none" stroke="#c99728" stroke-width="5"/><rect x="30" y="24" width="1354" height="952" rx="2" fill="none" stroke="#d8a83c" stroke-width="2"/><rect x="48" y="42" width="1318" height="916" fill="none" stroke="#e8c66f" stroke-width="1.5"/><path d="M40 70v-28h28M1374 70V42h-28M40 930v28h28M1374 930v28h-28" fill="none" stroke="#d7a83c" stroke-width="2"/><g fill="#f4e8c9" opacity=".7"><path d="M78 429c30-107 86-166 156-205-22 76-73 144-156 205zm10 24c68-74 132-105 196-112-48 59-109 96-196 112zm-14-62c-4-69 15-126 58-176 8 65-8 120-58 176zm126 86c58-86 119-129 194-146-38 72-101 123-194 146zM1330 429c-30-107-86-166-156-205 22 76 73 144 156 205zm-10 24c-68-74-132-105-196-112 48 59 109 96 196 112zm14-62c4-69-15-126-58-176-8 65 8 120 58 176zm-126 86c-58-86-119-129-194-146 38 72 101 123 194 146z"/></g><g transform="translate(144 104)"><rect width="58" height="58" rx="15" fill="#102f4c"/><path d="M18 38l10-20 5 10 9-5-12 18-2-8z" fill="#fff"/><text x="70" y="40" font-family="Arial" font-size="31" font-weight="700" fill="#102f4c">certify<tspan fill="#d39a25">.</tspan></text></g><text x="1284" y="70" text-anchor="end" font-family="Arial" font-size="12" font-weight="700" letter-spacing="3" fill="#506982">CERTIFICATE NO.</text><text x="1284" y="94" text-anchor="end" font-family="Arial" font-size="13" font-weight="700" letter-spacing="2" fill="#506982">SW-2026-0487</text><path d="M368 164h165m316 0h165" stroke="#d6a23b" stroke-width="2"/><text x="707" y="171" text-anchor="middle" font-family="Arial" font-size="19" font-weight="700" letter-spacing="8" fill="#153858">SUMMER WORKSHOP</text><text x="707" y="270" text-anchor="middle" font-family="Georgia" font-size="102" font-weight="700" fill="#102f4c">Certificate</text><text x="707" y="325" text-anchor="middle" font-family="Arial" font-size="29" letter-spacing="11" fill="#c89224">OF PARTICIPATION</text><text x="707" y="411" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" letter-spacing="3" fill="#274763">THIS IS TO CERTIFY THAT</text><path d="M356 610h300m116 0h300" stroke="#d6a23b" stroke-width="2"/><text x="707" y="619" text-anchor="middle" font-family="Georgia" font-size="30" fill="#d6a23b">✦</text><text x="707" y="668" text-anchor="middle" font-family="Arial" font-size="22" fill="#536981">has successfully completed the Summer Workshop 2026.</text><text x="707" y="708" text-anchor="middle" font-family="Arial" font-size="22" fill="#536981">We appreciate your dedication, effort and enthusiasm.</text><g transform="translate(202 824)" fill="none" stroke="#ca9224" stroke-width="3"><circle r="78"/><circle r="68"/><path d="M0-91v18m0 146v18m-91-91h18m146 0h18"/><path d="M-46 52c-58-13-74-59-73-94 30 8 52 37 57 66m-44-46 38 45m114 29c58-13 74-59 73-94-30 8-52 37-57 66m44-46-38 45"/></g><text x="202" y="831" text-anchor="middle" font-family="Georgia" font-size="30" font-weight="700" fill="#c48d1e">2026</text><text x="202" y="854" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" letter-spacing="2" fill="#bc891e">CERTIFIED</text><text x="1111" y="849" text-anchor="middle" font-family="Georgia" font-size="38" font-style="italic" fill="#173654">A. Rivera</text><path d="M1010 862h202" stroke="#c9952d" stroke-width="1.5"/><text x="1111" y="889" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700" letter-spacing="3" fill="#637b91">PROGRAM DIRECTOR</text>`
  const nameMarkup = name ? `<text data-draggable="name" x="${namePosition.x}" y="${namePosition.y}" text-anchor="middle" font-family="${nameFont}" font-size="${nameSize}" font-style="italic" font-weight="${fontWeight}" fill="${nameColor}" transform="rotate(${rotation} ${namePosition.x} ${namePosition.y})" style="cursor:move">${escaped}</text>` : ''
  const signatureMask = !templateImage ? '<rect x="970" y="800" width="285" height="125" fill="#fcfaf4"/>' : ''
  const signatureMarkup = !templateImage && signature
    ? '<text x="1111" y="849" text-anchor="middle" font-family="Georgia" font-size="38" font-style="italic" fill="#173654">A. Rivera</text><path d="M1010 862h202" stroke="#c9952d" stroke-width="1.5"/><text x="1111" y="889" text-anchor="middle" font-family="Arial" font-size="13" letter-spacing="3" fill="#637b91">PROGRAM DIRECTOR</text>'
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1414 1000" width="100%" height="100%">${background}${signatureMask}${nameMarkup}${imageMarkup}${signatureMarkup}</svg>`
}

async function svgToPdf(svg: string, name: string, namePosition: { x: number; y: number }, nameFont: NameFont, nameSize: number, isBold: boolean, nameColor: string, rotation: number) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const fontWeight = getNameFontWeight(isBold)
  await document.fonts.load(`${fontWeight} ${nameSize}px "${nameFont}"`)
  const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  const image = new Image()
  image.src = encoded
  await image.decode()
  const canvas = window.document.createElement('canvas')
  canvas.width = 1414
  canvas.height = 1000
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to render certificate preview')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  context.font = `${fontWeight} italic ${nameSize}px "${nameFont}"`
  context.textAlign = 'center'
  context.textBaseline = 'alphabetic'
  context.fillStyle = nameColor
  context.translate(namePosition.x, namePosition.y)
  context.rotate(rotation * Math.PI / 180)
  context.fillText(name, 0, 0)
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 842, 595, undefined, 'FAST')
  return new Uint8Array(pdf.output('arraybuffer'))
}

async function certificatePdf(template: ArrayBuffer | null, name: string, signature: boolean, namePosition: { x: number; y: number }, nameFont: NameFont, nameSize: number, isBold: boolean, nameColor: string, rotation: number) {
  if (!template) return svgToPdf(certificateSvg('', signature, null, { x: 1180, y: 690 }, null, namePosition, nameFont, nameSize, isBold, nameColor, rotation), name, namePosition, nameFont, nameSize, isBold, nameColor, rotation)
  const pdf = await PDFDocument.load(template.slice(0))
  const page = pdf.getPages()[0]
  const fontWeight = getNameFontWeight(isBold)
  await document.fonts.load(`${fontWeight} ${nameSize}px "${nameFont}"`)
  const canvas = window.document.createElement('canvas')
  canvas.width = 1414
  canvas.height = 1000
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to render certificate name')
  context.font = `${fontWeight} italic ${nameSize}px "${nameFont}"`
  context.textAlign = 'center'
  context.textBaseline = 'alphabetic'
  context.fillStyle = nameColor
  context.translate(namePosition.x, namePosition.y)
  context.rotate(rotation * Math.PI / 180)
  context.fillText(name, 0, 0)
  const nameImage = await pdf.embedPng(canvas.toDataURL('image/png'))
  page.drawImage(nameImage, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() })
  return pdf.save()
}

export default function Page() {
  const [recipients, setRecipients] = useState(starterRecipients)
  const [selected, setSelected] = useState(0)
  const [csvName, setCsvName] = useState('')
  const [signature, setSignature] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [certificateTemplate, setCertificateTemplate] = useState<ArrayBuffer | null>(null)
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null)
  const [certificateName, setCertificateName] = useState('')
  const [imagePosition, setImagePosition] = useState({ x: 1180, y: 690 })
  const [namePosition, setNamePosition] = useState({ x: 707, y: 580 })
  const [nameFont, setNameFont] = useState<NameFont>('Georgia')
  const [nameSize, setNameSize] = useState(58)
  const [isBold, setIsBold] = useState(true)
  const [nameColor, setNameColor] = useState('#0f2d4a')
  const [rotation, setRotation] = useState(0)
  const [activeDrag, setActiveDrag] = useState<'name' | 'image' | null>(null)
  const [zoom, setZoom] = useState(76)
  const [saved, setSaved] = useState(false)
  const csvInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const recipient = recipients[selected] ?? { name: '' }
  const exportableRecipients = recipients.filter((item) => !item.demo)
  const svg = useMemo(() => certificateSvg(recipient.name, signature, uploadedImage, imagePosition, certificatePreview, namePosition, nameFont, nameSize, isBold, nameColor, rotation), [recipient.name, signature, uploadedImage, imagePosition, certificatePreview, namePosition, nameFont, nameSize, isBold, nameColor, rotation])

  function deleteRecipient(index: number) {
    setRecipients((current) => current.filter((_, recipientIndex) => recipientIndex !== index))
    setSelected((current) => current === index ? Math.max(0, index - 1) : current > index ? current - 1 : current)
    setSaved(false)
  }

  function parseCsv(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const rows = String(reader.result ?? '').split(/\r?\n/).map((row) => row.split(',')[0].trim().replace(/^"|"$/g, '').replace(/\s+/g, ' ')).filter(Boolean)
      const names = rows[0]?.toLowerCase() === 'name' ? rows.slice(1) : rows
      const uniqueNames = [...new Map(names.map((name) => [name.toLowerCase(), name])).values()]
      if (uniqueNames.length) { setRecipients(uniqueNames.map((name) => ({ name }))); setSelected(0); setCsvName(file.name); setSaved(false) }
    }
    reader.readAsText(file)
  }

  async function handleCertificate(file: File) {
    if (file.type !== 'application/pdf') return
    const template = await file.arrayBuffer()
    const document = await pdfjs.getDocument({ data: new Uint8Array(template.slice(0)) }).promise
    const page = await document.getPage(1)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = window.document.createElement('canvas')
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    const context = canvas.getContext('2d')
    if (!context) return
    await page.render({ canvas, canvasContext: context, viewport }).promise
    setCertificateTemplate(template)
    setCertificatePreview(canvas.toDataURL('image/png'))
    setCertificateName(file.name)
    setNamePosition({ x: 707, y: 580 })
    setSaved(false)
  }

  function handleImage(file: File) {
    const reader = new FileReader()
    reader.onload = () => { setUploadedImage(String(reader.result)); setSaved(false) }
    reader.readAsDataURL(file)
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setActiveDrag(null)
    const file = event.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleImage(file)
  }

  function startPreviewDrag(event: React.PointerEvent<HTMLDivElement>) {
    const dragTarget = (event.target as Element).closest('[data-draggable]')?.getAttribute('data-draggable')
    if (dragTarget !== 'name' && dragTarget !== 'image') return
    if (dragTarget === 'image' && !uploadedImage) return
    setActiveDrag(dragTarget)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function movePreviewItem(event: React.PointerEvent<HTMLDivElement>) {
    if (!activeDrag) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(80, Math.min(1334, ((event.clientX - rect.left) / rect.width) * 1414))
    const y = Math.max(100, Math.min(940, ((event.clientY - rect.top) / rect.height) * 1000))
    if (activeDrag === 'name') setNamePosition({ x, y })
    else setImagePosition({ x: Math.max(120, Math.min(1290, x)), y: Math.max(120, Math.min(880, y)) })
    setSaved(false)
  }

  async function downloadZip() {
    if (!exportableRecipients.length) return
    const files: Record<string, Uint8Array> = {}
    for (const [index, item] of exportableRecipients.entries()) files[`certificate-${index + 1}-${safeName(item.name)}.pdf`] = await certificatePdf(certificateTemplate, item.name, signature, namePosition, nameFont, nameSize, isBold, nameColor, rotation)
    const blob = new Blob([zipSync(files, { level: 6 })], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'summer-workshop-certificates.zip'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return <main className="editor-shell flex h-dvh flex-col overflow-hidden bg-[#f7f8fa] text-[#20242c]">
    <header className="flex h-[58px] shrink-0 items-center justify-between border-b bg-white px-8"><div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-[10px] bg-[#2855d9] text-white"><Sparkles size={18} /></span><strong>certify<span className="text-[#2855d9]">.</span></strong><span className="ml-5 text-sm text-[#777f8f]">Projects / Summer Workshop</span></div><div className="flex items-center gap-2"><button onClick={() => setSaved(true)} className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm"><Save size={15} />{saved ? 'Saved' : 'Save'}</button><button onClick={downloadZip} disabled={!exportableRecipients.length} title={!exportableRecipients.length ? 'Add a recipient or upload names to export' : undefined} className="flex h-9 items-center gap-2 rounded-lg bg-[#2855d9] px-3.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"><Download size={15} />Export PDF</button></div></header>
    <div className="workspace flex min-h-0 flex-1 overflow-hidden">
      <aside className="w-[280px] shrink-0 overflow-y-auto border-r bg-white p-6">
        <h1 className="text-xl font-semibold">Build your certificate</h1>
        <p className="sidebar-intro mt-2 text-sm text-[#7d8593]">Upload recipients, add artwork, and position it directly on the certificate.</p>
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={() => document.getElementById('certificate-pdf-input')?.click()} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><FileText size={16} />Upload certificate PDF{certificateName && <Check className="upload-check" size={15} />}<input id="certificate-pdf-input" className="hidden" type="file" accept="application/pdf,.pdf" onChange={(event) => event.target.files?.[0] && handleCertificate(event.target.files[0])} /></button>
          <span className="text-xs text-[#7d8593]">{certificateName || 'No PDF template loaded'}</span>
          <button onClick={() => csvInput.current?.click()} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><Upload size={16} />Upload names CSV{csvName && <Check className="upload-check" size={15} />}<input ref={csvInput} className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && parseCsv(event.target.files[0])} /></button>
          <span className="text-xs text-[#7d8593]">{csvName || <>{recipients.some((item) => item.demo) && <><span className="demo-badge">Demo</span>{' '}</>}{exportableRecipients.length ? `${exportableRecipients.length} ${exportableRecipients.length === 1 ? 'recipient' : 'recipients'} loaded` : 'recipient only'}</>}</span>
          <button onClick={() => imageInput.current?.click()} className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm"><ImagePlus size={16} />Upload Signature{uploadedImage && <Check className="upload-check" size={15} />}<input ref={imageInput} className="hidden" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && handleImage(event.target.files[0])} /></button>
        </div>
        <div className="recipient-list mt-6 flex flex-col gap-1">{recipients.map((item, index) => <div key={`${item.name}-${index}`} className={`recipient-row ${selected === index ? 'selected' : ''}`}><button onClick={() => setSelected(index)} className="recipient-select"><span className="recipient-name">{item.name || 'Unnamed recipient'}</span>{item.demo && <span className="demo-badge">Demo</span>}</button><button type="button" aria-label={`Delete ${item.name || 'recipient'}`} title={`Delete ${item.name || 'recipient'}`} onClick={() => deleteRecipient(index)} className="delete-recipient"><X size={15} /></button></div>)}</div>
        <button onClick={() => { setRecipients([...recipients, { name: 'New recipient' }]); setSaved(false) }} className="add-recipient-button"><Plus size={19} />Add recipient</button>
        {recipients.some((item) => item.demo) && <p className="demo-note">The demo name is for preview only and will not be added to exported certificates.</p>}
      </aside>
      <section className="flex min-w-0 flex-1 flex-col p-6"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-[#7e8694]"><FileImage size={15} />{certificateName || 'completion-certificate.pdf'}</div><div className="flex items-center gap-2"><button aria-label="Zoom out" onClick={() => setZoom(Math.max(40, zoom - 10))}><ZoomOut size={16} /></button><span className="w-10 text-center text-xs">{zoom}%</span><button aria-label="Zoom in" onClick={() => setZoom(Math.min(110, zoom + 10))}><ZoomIn size={16} /></button><button onClick={() => setZoom(76)} className="text-xs text-[#2855d9]">Fit</button></div></div><div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-[#eef0f3] p-5" style={{ backgroundImage: 'radial-gradient(#d9dde4 1px, transparent 1px)', backgroundSize: '16px 16px' }}><div onPointerDown={startPreviewDrag} onPointerMove={movePreviewItem} onPointerUp={() => setActiveDrag(null)} className="relative aspect-[1.414/1] h-full max-h-full w-auto max-w-full bg-[#fcfaf4] shadow-xl" style={{ transform: `scale(${zoom / 76})`, cursor: activeDrag ? 'grabbing' : 'default', touchAction: 'none' }} dangerouslySetInnerHTML={{ __html: svg.replace('</svg>', `<text x="${imagePosition.x}" y="${imagePosition.y + 95}" text-anchor="middle" font-family="Arial" font-size="16" fill="#7d8593">${uploadedImage ? 'Drag image to reposition' : ''}</text></svg>`) }} /> </div></section>
      <aside className="w-[286px] shrink-0 overflow-y-auto border-l bg-white p-6">
        <h2 className="font-semibold">Properties</h2>
        <div className="mt-5 flex flex-col gap-4">
          <label className="text-sm">Recipient name<input value={recipient.name} onChange={(event) => { const next = [...recipients]; next[selected] = { name: event.target.value }; setRecipients(next); setSaved(false) }} className="mt-2 h-10 w-full rounded-lg border px-3" /></label>
          <div className="property-section flex flex-col gap-3 border-t pt-4">
            <h3 className="text-sm font-semibold">Edit text</h3>
            <label htmlFor="name-font" className="text-sm">Font<select id="name-font" value={nameFont} onChange={(event) => { setNameFont(event.target.value as NameFont); setSaved(false) }} className="mt-2 h-10 w-full rounded-lg border bg-white px-3"><option value="Georgia">Playfair Display (Serif)</option><option value="Cinzel">Cinzel</option><option value="Great Vibes">Great Vibes</option><option value="Arial">Arial</option></select></label>
            <label htmlFor="name-size" className="text-sm">Size<input id="name-size" type="number" min={12} max={120} step={1} value={nameSize} onChange={(event) => { setNameSize(Math.min(120, Math.max(12, Number(event.target.value) || 12))); setSaved(false) }} className="mt-2 h-10 w-full rounded-lg border px-3" /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isBold} onChange={(event) => { setIsBold(event.target.checked); setSaved(false) }} />Bold</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={signature} onChange={(event) => { setSignature(event.target.checked); setSaved(false) }} />Show signature</label>
            <label className="property-color text-sm">Color<div className="color-field"><input aria-label="Text color" type="color" value={nameColor} onChange={(event) => { setNameColor(event.target.value); setSaved(false) }} /><span>{nameColor.toUpperCase()}</span></div></label>
            <div className="property-position text-sm">Position<div className="position-grid">{Array.from({ length: 9 }, (_, index) => { const x = [250, 707, 1164][index % 3]; const y = [430, 580, 730][Math.floor(index / 3)]; const active = Math.abs(namePosition.x - x) < 100 && Math.abs(namePosition.y - y) < 100; return <button key={index} aria-label={`Set text position ${index + 1}`} className={active ? 'active' : ''} onClick={() => { setNamePosition({ x, y }); setSaved(false) }}><span /></button> })}</div></div>
            <label className="property-rotation text-sm">Rotation<div className="rotation-field"><input aria-label="Rotation" type="range" min="-45" max="45" value={rotation} onChange={(event) => { setRotation(Number(event.target.value)); setSaved(false) }} /><span>{rotation}°</span></div></label>
            <button className="reset-default" onClick={() => { setNamePosition({ x: 707, y: 580 }); setNameFont('Georgia'); setNameSize(58); setIsBold(true); setNameColor('#0f2d4a'); setRotation(0); setSignature(true); setSaved(false) }}><RotateCcw size={13} />Reset to default</button>
          </div>
          {uploadedImage && <label className="text-sm">Certificate image<div className="mt-2 flex items-center gap-2 text-xs text-[#7d8593]"><Move size={14} />Drag image on preview to reposition</div></label>}
          {uploadedImage && <button onClick={() => { setImagePosition({ x: 1180, y: 690 }); setSaved(false) }} className="rounded-lg border px-3 py-2 text-sm">Reset image position</button>}
        </div>
      </aside>
    </div>
  </main>
}
