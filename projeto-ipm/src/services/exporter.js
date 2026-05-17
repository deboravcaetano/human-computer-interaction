const normalizeRows = (data) => {
  if (Array.isArray(data)) return data
  if (data == null) return []
  return [data]
}

const flattenValue = (value) => {
  if (value == null) return ''
  if (Array.isArray(value)) return value.map(flattenValue).join('; ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const getHeaders = (rows) => {
  const headers = new Set()
  rows.forEach((row) => {
    if (row && typeof row === 'object' && !Array.isArray(row)) {
      Object.keys(row).forEach((key) => headers.add(key))
    }
  })
  return [...headers]
}

const downloadFile = (filename, content, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const sanitizeFilename = (filename) =>
  String(filename || 'export')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'export'

const csvEscape = (value) => `"${flattenValue(value).replace(/"/g, '""')}"`

const exportJson = ({ filename, title, data, metadata }) => {
  const content = JSON.stringify(
    {
      title,
      exportedAt: new Date().toISOString(),
      metadata,
      data,
    },
    null,
    2,
  )

  downloadFile(`${filename}.json`, content, 'application/json;charset=utf-8')
}

const exportCsv = ({ filename, data }) => {
  const rows = normalizeRows(data)
  const headers = getHeaders(rows)

  const content = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row?.[header])).join(',')),
  ].join('\n')

  downloadFile(`${filename}.csv`, content, 'text/csv;charset=utf-8')
}

const escapeHtml = (value) =>
  flattenValue(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const exportPdf = ({ title, data, metadata }) => {
  const rows = normalizeRows(data)
  const headers = getHeaders(rows)
  const exportedAt = new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())

  const metadataRows = Object.entries(metadata ?? {})
    .filter(([, value]) => value !== '' && value != null)
    .map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</p>`)
    .join('')

  const tableRows = rows
    .map(
      (row) => `
        <tr>
          ${headers.map((header) => `<td>${escapeHtml(row?.[header])}</td>`).join('')}
        </tr>
      `,
    )
    .join('')

  const html = `
    <!doctype html>
    <html lang="pt">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #101d42; margin: 32px; }
          h1 { font-size: 24px; margin: 0 0 8px; }
          p { margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #d8dee9; padding: 8px; text-align: left; vertical-align: top; }
          th { background: #f2f5fb; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <p><strong>Exportado em:</strong> ${escapeHtml(exportedAt)}</p>
        ${metadataRows}
        <table>
          <thead>
            <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <script>
          window.addEventListener('load', () => {
            window.print()
          })
        </script>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

export function exportData({ format, filename = 'export', title = 'Exportação', data, metadata = {} }) {
  const normalizedFilename = sanitizeFilename(filename)

  const payload = {
    filename: normalizedFilename,
    title,
    data,
    metadata,
  }

  if (format === 'JSON') exportJson(payload)
  if (format === 'CSV') exportCsv(payload)
  if (format === 'PDF') exportPdf(payload)
}
