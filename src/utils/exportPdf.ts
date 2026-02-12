import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Project } from '@/types';
import { formatTimeCode } from './timeCode';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
  }
}

export function exportProjectPdf(project: Project) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(16);
  doc.text(project.meta.name, pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`${new Date().toLocaleDateString('ko-KR')} | ${project.meta.frameRate}fps`, pageWidth / 2, 21, { align: 'center' });

  let yPos = 28;

  for (const seq of project.storyboard.sequences) {
    for (const scene of seq.scenes) {
      if (yPos > 180) {
        doc.addPage();
        yPos = 15;
      }

      // Scene header
      doc.setFontSize(10);
      doc.text(`${seq.name} > ${scene.name}`, 14, yPos);
      yPos += 4;

      const tableData = scene.shots.map((shot) => {
        return [
          shot.cutNumber,
          shot.image ? '[IMAGE]' : '',
          formatTimeCode(shot.time),
          shot.action || '',
          shot.dialogue || '',
        ];
      });

      doc.autoTable({
        startY: yPos,
        head: [['Cut', 'Image', 'Time', 'Action', 'Dialogue']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 30, 30],
          textColor: [200, 200, 200],
          fontSize: 7,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [50, 50, 50],
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 18, halign: 'center' },
          1: { cellWidth: 55 },
          2: { cellWidth: 18, halign: 'center' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
        },
        margin: { left: 14, right: 14 },
        didDrawCell: (data: { column: { index: number }; row: { section: string; index: number }; cell: { x: number; y: number; width: number; height: number } }) => {
          if (data.column.index === 1 && data.row.section === 'body') {
            const shot = scene.shots[data.row.index];
            if (shot?.image) {
              try {
                doc.addImage(
                  shot.image.dataUrl,
                  'JPEG',
                  data.cell.x + 1,
                  data.cell.y + 1,
                  data.cell.width - 2,
                  data.cell.height - 2
                );
              } catch {
                // Skip if image can't be added
              }
            }
          }
        },
      });

      // Get the final Y position after autoTable
      yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
    }
  }

  doc.save(`${project.meta.name}.pdf`);
}
