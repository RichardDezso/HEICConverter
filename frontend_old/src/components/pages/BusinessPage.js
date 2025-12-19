import { ConverterGuidePage } from '../ConverterGuidePage';

export const BusinessPage = () => {
  const relatedPages = [
    {
      title: 'Batch Convert HEIC to PDF',
      description: 'Process multiple files efficiently',
      path: '/batch-convert-heic-to-pdf'
    },
    {
      title: 'HEIC to PDF Quality Guide',
      description: 'Maintain professional quality standards',
      path: '/heic-pdf-quality-guide'
    },
    {
      title: 'Troubleshooting Guide',
      description: 'Solve common conversion issues',
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
      postId="heic-to-pdf-for-business"
      pageTitle="HEIC to PDF for Business: Document Processing Made Simple"
      pageDescription="Streamline business workflows by converting HEIC files to PDF. Perfect for customer uploads and document management."
      relatedPages={relatedPages}
    />
  );
};
