import { ConverterGuidePage } from '../ConverterGuidePage';

export const QualityGuidePage = () => {
  const relatedPages = [
    {
      title: 'Batch Convert HEIC to PDF',
      description: 'Convert multiple HEIC files at once',
      path: '/batch-convert-heic-to-pdf'
    },
    {
      title: 'HEIC vs JPEG for PDF',
      description: 'Compare quality and file size between formats',
      path: '/heic-vs-jpeg-pdf'
    },
    {
      title: 'HEIC to PDF for Business',
      description: 'Professional document processing solutions',
      path: '/heic-pdf-business'
    },
    {
      title: 'Main Converter',
      description: 'Convert HEIC to PDF, JPG, or PNG',
      path: '/'
    }
  ];

  return (
    <ConverterGuidePage
      postId="heic-to-pdf-quality-guide"
      pageTitle="HEIC to PDF Quality Guide: Maintaining Image Resolution"
      pageDescription="Ensure your HEIC to PDF conversions maintain perfect image quality. Learn about resolution, compression, and best practices."
      relatedPages={relatedPages}
    />
  );
};
