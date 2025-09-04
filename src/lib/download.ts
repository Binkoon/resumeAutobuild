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
 * PDF로 다운로드 (HTML to PDF 방식으로 한글 지원)
 */
async function downloadAsPDF(cvData: CVData): Promise<void> {
  try {
    // HTML을 PDF로 변환하는 방식 사용 (한글 지원)
    const html = generateHTML(cvData);
    
    // 브라우저의 인쇄 기능을 사용하여 PDF 생성
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('팝업이 차단되었습니다. 팝업을 허용해주세요.');
    }
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    // CSS 추가 (인쇄용 스타일)
    const printStyles = `
      <style>
        @media print {
          body { 
            font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
        @page {
          margin: 0.5in;
          size: A4;
        }
      </style>
    `;
    
    printWindow.document.head.insertAdjacentHTML('beforeend', printStyles);
    
    // 인쇄 대화상자 열기
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
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
            font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
