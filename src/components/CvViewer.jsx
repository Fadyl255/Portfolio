import { useCallback, useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { ChevronLeft, ChevronRight, FileWarning, LoaderCircle, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const MIN_ZOOM = 0.5
const MAX_ZOOM = 2.5
const STEP = 0.25
const MAX_FIT_WIDTH = 860 // largeur maximale d'une page à 100 %

/**
 * Visionneuse PDF intégrée : défilement vertical, zoom, navigation entre pages.
 * Chargée à la demande (React.lazy) pour garder le site léger.
 * Le parent lui donne une `key` par fichier : changer de version
 * remonte le composant, ce qui réinitialise page, zoom et défilement.
 */
export default function CvViewer({ file, labels }) {
  const scrollRef = useRef(null)
  const pageRefs = useRef([])
  const [width, setWidth] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [current, setCurrent] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [failed, setFailed] = useState(false)

  // Largeur disponible → largeur de page « ajustée »
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // Une largeur nulle (élément masqué) est ignorée pour ne pas démonter le document
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w > 0) setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Page courante selon le défilement
  useEffect(() => {
    const root = scrollRef.current
    if (!root || numPages === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(Number(e.target.dataset.page))
        })
      },
      { root, threshold: 0.5 },
    )
    pageRefs.current.slice(0, numPages).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [numPages, zoom, width])

  const goTo = useCallback((n) => {
    const target = pageRefs.current[n - 1]
    const root = scrollRef.current
    if (!target || !root) return
    root.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' })
    setCurrent(n)
  }, [])

  const fitWidth = Math.max(Math.min(width - 32, MAX_FIT_WIDTH), 200)
  const pageWidth = Math.round(fitWidth * zoom)

  const btn =
    'grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-soft hover:text-fg disabled:pointer-events-none disabled:opacity-35'

  return (
    <div className="overflow-hidden rounded border border-line bg-elev">
      {/* Barre d'outils */}
      <div className="flex items-center justify-between gap-2 border-b border-line px-2 py-2 sm:px-3">
        <div className="flex items-center gap-1">
          <button type="button" className={btn} onClick={() => goTo(current - 1)} disabled={current <= 1} aria-label={labels.prev} title={labels.prev}>
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[88px] text-center font-mono text-xs text-muted" aria-live="polite">
            {labels.page} {numPages ? current : '–'} {labels.of} {numPages || '–'}
          </span>
          <button type="button" className={btn} onClick={() => goTo(current + 1)} disabled={current >= numPages} aria-label={labels.next} title={labels.next}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" className={btn} onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - STEP).toFixed(2)))} disabled={zoom <= MIN_ZOOM} aria-label={labels.zoomOut} title={labels.zoomOut}>
            <ZoomOut size={17} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="h-9 min-w-[56px] rounded-lg px-2 font-mono text-xs text-muted transition-colors hover:bg-soft hover:text-fg"
            aria-label={labels.fit}
            title={labels.fit}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button type="button" className={btn} onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + STEP).toFixed(2)))} disabled={zoom >= MAX_ZOOM} aria-label={labels.zoomIn} title={labels.zoomIn}>
            <ZoomIn size={17} />
          </button>
          <button type="button" className={`${btn} hidden sm:grid`} onClick={() => setZoom(1)} aria-label={labels.fit} title={labels.fit}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Zone de lecture */}
      <div
        ref={scrollRef}
        className="relative max-h-[75vh] min-h-[320px] overflow-auto overscroll-contain bg-soft p-4 sm:h-[78vh] sm:max-h-[1100px] sm:min-h-[420px]"
        tabIndex={0}
        aria-label={labels.title}
      >
        {failed ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <FileWarning className="mx-auto text-subtle" size={36} />
              <p className="mt-3 font-medium">{labels.error}</p>
              <p className="mt-1 text-sm text-muted">{labels.errorHint}</p>
            </div>
          </div>
        ) : (
          width > 0 && (
            <Document
              file={file}
              suspense={false}
              onLoadSuccess={({ numPages: n }) => setNumPages(n)}
              onLoadError={() => setFailed(true)}
              onSourceError={() => setFailed(true)}
              loading={<Loading text={labels.loading} />}
              error={<span />}
              className="flex flex-col gap-6"
            >
              {Array.from({ length: numPages }, (_, i) => (
                <div
                  key={i}
                  data-page={i + 1}
                  ref={(el) => (pageRefs.current[i] = el)}
                  className="pdf-page mx-auto w-fit"
                >
                  <Page pageNumber={i + 1} width={pageWidth} loading={<div style={{ width: pageWidth, height: pageWidth * 1.414 }} className="bg-white" />} />
                </div>
              ))}
            </Document>
          )
        )}
      </div>
    </div>
  )
}

function Loading({ text }) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-sm text-muted sm:h-[60vh]">
      <LoaderCircle className="animate-spin text-accent" size={28} />
      {text}
    </div>
  )
}
