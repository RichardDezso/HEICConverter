import { ConverterGuidePage } from '../ConverterGuidePage';

export const ComparisonPage = () => {
  const relatedPages = [
    {
      title: 'HEIC to PDF Quality Guide',
      description: 'Understand quality differences in detail',
      path: '/heic-pdf-quality-guide'
    },
    {
      title: 'Batch Convert HEIC to PDF',
      description: 'Convert multiple files efficiently',
      path: '/batch-convert-heic-to-pdf'
    },
    {
      title: 'Troubleshooting Guide',
      description: 'Fix format-related conversion issues',
      path: '/heic-pdf-troubleshooting'
    },
    {
      title: 'Main Converter',
      description: 'Convert HEIC to PDF, JPG, or PNG',
      path: '/'
    }
  ];

  return (
    <ConverterGuidePage
      postId="heic-pdf-vs-jpeg-pdf"
      pageTitle="HEIC to PDF vs JPEG to PDF: Which Should You Use?"
      pageDescription="Compare HEIC and JPEG to PDF conversion. Learn which format works best for quality, file size, and compatibility."
      relatedPages={relatedPages}
    />
  );
};
