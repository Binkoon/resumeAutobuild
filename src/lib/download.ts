import type { CVData } from '../types/cv';
import { buildMarkdown } from './markdown';

export type DownloadFormat = 'pdf' | 'markdown' | 'html';

/**
 * CV를 선택한 형식으로 다운로드
 */
export async function downloadCV(cvData: CVData, format: DownloadFormat, onComplete?: () => void): Promise<void> {
  try {
    switch (format) {
      case 'pdf':
        await downloadAsPDF(cvData);
        break;
      case 'markdown':
        downloadAsMarkdown(cvData);
        break;
      case 'html':
        downloadAsHTML(cvData);
        break;
      default:
        throw new Error(`지원하지 않는 형식: ${format}`);
    }
    
    // 다운로드 완료 후 콜백 실행 (초기화 등)
    if (onComplete) {
      onComplete();
    }
  } catch (error) {
    console.error('다운로드 실패:', error);
    throw error;
  }
}

/**
 * PDF로 다운로드 (jsPDF 사용)
 */
async function downloadAsPDF(cvData: CVData): Promise<void> {
  try {
    // jsPDF 동적 import
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;
    
    // 제목
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(cvData.personalInfo.name || '이름', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // 연락처 정보
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [
      cvData.personalInfo.email,
      cvData.personalInfo.phone,
      cvData.personalInfo.location
    ].filter(Boolean).join(' | ');
    
    if (contactInfo) {
      doc.text(contactInfo, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }
    
    // 자기소개
    if (cvData.personalInfo.summary) {
      yPosition += 5;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('자기소개', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(cvData.personalInfo.summary, pageWidth - 2 * margin);
      doc.text(summaryLines, margin, yPosition);
      yPosition += summaryLines.length * 6 + 10;
    }
    
    // 스킬
    if (cvData.skills.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('스킬', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const skillsText = cvData.skills.join(', ');
      doc.text(skillsText, margin, yPosition);
      yPosition += 15;
    }
    
    // 경력사항
    if (cvData.experience.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('경력사항', margin, yPosition);
      yPosition += 8;
      
      cvData.experience.forEach((exp, index) => {
        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${exp.position} - ${exp.company}`, margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${exp.startDate} - ${exp.endDate}`, margin, yPosition);
        yPosition += 6;
        
        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, pageWidth - 2 * margin);
          doc.text(descLines, margin, yPosition);
          yPosition += descLines.length * 5 + 5;
        }
        
        if (index < cvData.experience.length - 1) {
          yPosition += 5;
        }
      });
    }
    
    // 교육사항
    if (cvData.education.length > 0) {
      if (yPosition > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('교육사항', margin, yPosition);
      yPosition += 8;
      
      cvData.education.forEach((edu, index) => {
        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${edu.degree} - ${edu.school}`, margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${edu.field} | ${edu.startDate} - ${edu.endDate}`, margin, yPosition);
        yPosition += 8;
      });
    }
    
    // 프로젝트
    if (cvData.projects.length > 0) {
      if (yPosition > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('프로젝트', margin, yPosition);
      yPosition += 8;
      
      cvData.projects.forEach((project, index) => {
        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(project.name, margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        if (project.technologies.length > 0) {
          doc.text(`기술: ${project.technologies.join(', ')}`, margin, yPosition);
          yPosition += 6;
        }
        
        doc.text(`${project.startDate} - ${project.endDate}`, margin, yPosition);
        yPosition += 6;
        
        if (project.description) {
          const descLines = doc.splitTextToSize(project.description, pageWidth - 2 * margin);
          doc.text(descLines, margin, yPosition);
          yPosition += descLines.length * 5 + 5;
        }
        
        if (index < cvData.projects.length - 1) {
          yPosition += 5;
        }
      });
    }
    
    // 파일명 생성
    const fileName = `${cvData.personalInfo.name || 'CV'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // PDF 다운로드
    doc.save(fileName);
    
  } catch (error) {
    console.error('PDF 생성 실패:', error);
    throw new Error('PDF 생성에 실패했습니다.');
  }
}

/**
 * Markdown으로 다운로드
 */
function downloadAsMarkdown(cvData: CVData): void {
  try {
    const markdown = buildMarkdown(cvData);
    const fileName = `${cvData.personalInfo.name || 'CV'}_${new Date().toISOString().split('T')[0]}.md`;
    
    downloadTextFile(markdown, fileName, 'text/markdown');
  } catch (error) {
    console.error('Markdown 생성 실패:', error);
    throw new Error('Markdown 생성에 실패했습니다.');
  }
}

/**
 * HTML로 다운로드
 */
function downloadAsHTML(cvData: CVData): void {
  try {
    const html = generateHTML(cvData);
    const fileName = `${cvData.personalInfo.name || 'CV'}_${new Date().toISOString().split('T')[0]}.html`;
    
    downloadTextFile(html, fileName, 'text/html');
  } catch (error) {
    console.error('HTML 생성 실패:', error);
    throw new Error('HTML 생성에 실패했습니다.');
  }
}

/**
 * 텍스트 파일 다운로드 헬퍼 함수
 */
function downloadTextFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * HTML 생성 함수
 */
function generateHTML(cvData: CVData): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cvData.personalInfo.name || 'CV'}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .name {
            font-size: 2.5em;
            color: #1e293b;
            margin: 0;
        }
        .contact-info {
            color: #64748b;
            margin: 10px 0;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 1.5em;
            color: #3b82f6;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .item {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 8px;
        }
        .item-title {
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 5px;
        }
        .item-subtitle {
            color: #64748b;
            font-size: 0.9em;
            margin-bottom: 10px;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .skill-tag {
            background-color: #3b82f6;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">${cvData.personalInfo.name || '이름'}</h1>
        <div class="contact-info">
            ${cvData.personalInfo.email ? `${cvData.personalInfo.email} | ` : ''}
            ${cvData.personalInfo.phone ? `${cvData.personalInfo.phone} | ` : ''}
            ${cvData.personalInfo.location || ''}
        </div>
    </div>
    
    ${cvData.personalInfo.summary ? `
    <div class="section">
        <h2 class="section-title">자기소개</h2>
        <p>${cvData.personalInfo.summary}</p>
    </div>
    ` : ''}
    
    ${cvData.skills.length > 0 ? `
    <div class="section">
        <h2 class="section-title">스킬</h2>
        <div class="skills">
            ${cvData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}
    
    ${cvData.experience.length > 0 ? `
    <div class="section">
        <h2 class="section-title">경력사항</h2>
        ${cvData.experience.map(exp => `
        <div class="item">
            <div class="item-title">${exp.position} - ${exp.company}</div>
            <div class="item-subtitle">${exp.startDate} - ${exp.endDate}</div>
            ${exp.description ? `<p>${exp.description}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${cvData.education.length > 0 ? `
    <div class="section">
        <h2 class="section-title">교육사항</h2>
        ${cvData.education.map(edu => `
        <div class="item">
            <div class="item-title">${edu.degree} - ${edu.school}</div>
            <div class="item-subtitle">${edu.field} | ${edu.startDate} - ${edu.endDate}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${cvData.projects.length > 0 ? `
    <div class="section">
        <h2 class="section-title">프로젝트</h2>
        ${cvData.projects.map(project => `
        <div class="item">
            <div class="item-title">${project.name}</div>
            <div class="item-subtitle">
                ${project.technologies.length > 0 ? `기술: ${project.technologies.join(', ')} | ` : ''}
                ${project.startDate} - ${project.endDate}
            </div>
            ${project.description ? `<p>${project.description}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;
}
