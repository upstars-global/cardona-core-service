import { ExportFormat } from '../../../../@model/templates/baseList'

export const downloadReport = (report: string, entityName: string, format: ExportFormat) => {
  const fakeLink: HTMLElement = document.createElement('a')
  const downloadUrl = window.URL.createObjectURL(new Blob([report]))

  if (format === ExportFormat.XLSX) {
    fakeLink.setAttribute(
      'href',
      downloadUrl,
    )
  }
  else {
    fakeLink.setAttribute(
      'href',
      `data:${downloadUrl};charset=utf-8,${encodeURIComponent(report)}`,
    )
  }
  fakeLink.setAttribute('target', '_blank')
  fakeLink.setAttribute('download', `${entityName}Report.${format}`)
  fakeLink.click()
}
