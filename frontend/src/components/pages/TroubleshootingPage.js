import { ConverterGuidePage } from '../ConverterGuidePage';

export const TroubleshootingPage = () => {
  const relatedPages = [
    {
      title: 'HEIC to PDF Quality Guide',
      description: 'Prevent quality issues before they happen',
      path: '/heic-pdf-quality-guide'
    },
    {
      title: 'Batch Convert HEIC to PDF',
      description: 'Troubleshoot batch conversion problems',
      path: '/batch-convert-heic-to-pdf'
    },
    {
      title: 'HEIC vs JPEG for PDF',
      description: 'Choose the right format to avoid issues',
      path: '/heic-vs-jpeg-pdf'
    },
    {
      title: 'Main Converter',
      description: 'Convert HEIC to PDF, JPG, or PNG',
      path: '/'
    }
  ];

  return (
    <ConverterGuidePage
      postId="heic-to-pdf-troubleshooting"
      pageTitle="HEIC to PDF Troubleshooting: Common Problems and Solutions"
      pageDescription="Fix common HEIC to PDF conversion issues including upload errors, quality problems, and compatibility errors."
      relatedPages={relatedPages}
    />
  );
};
