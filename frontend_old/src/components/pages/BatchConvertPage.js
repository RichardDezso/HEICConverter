import { ConverterGuidePage } from '../ConverterGuidePage';

export const BatchConvertPage = () => {
  const relatedPages = [
    {
      title: 'HEIC to PDF Quality Guide',
      description: 'Learn how to maintain perfect image quality when converting',
      path: '/heic-pdf-quality-guide'
    },
    {
      title: 'HEIC to PDF for Business',
      description: 'Streamline business workflows with HEIC to PDF conversion',
      path: '/heic-pdf-business'
    },
    {
      title: 'Troubleshooting Guide',
      description: 'Fix common HEIC to PDF conversion problems',
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
      postId="how-to-batch-convert-heic-to-pdf"
      pageTitle="Batch Convert Multiple HEIC Files to PDF at Once"
      pageDescription="Convert multiple HEIC images to PDF in one go. Save time with batch processing for documents, photo collections, and more."
      relatedPages={relatedPages}
    />
  );
};
