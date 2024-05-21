// import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// // import PDFParser from 'pdf2json'
// import * as pdfjs from 'pdfjs-dist';
// // import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
// // import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
// // await import('pdfjs-dist/build/pdf.worker.min.mjs');
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";



// export const extractTextFromPdf = async (buffer:ArrayBuffer)=>{
//     const blob = new Blob([buffer])
//     const pdfURL = URL.createObjectURL(blob)
//   //   const loader = new PDFLoader(blob, {
//   //       // you may need to add `.then(m => m.default)` to the end of the import
//   //       pdfjs: () => import("pdfjs-dist"),
//   //     });
//   //     // const loader = new WebPDFLoader(blob)
//   //   console.log("here2")
//   //   const docs = await loader.load()
//   //   console.log("here3")

//   //   // const data =  (await pdfjs.getDocument(buffer).promise).getData()
//   //   // const docs = await data
//   //   // const buffer = 
//   //   const splitter = new RecursiveCharacterTextSplitter();
//   //   const splitDocs = await splitter.splitDocuments(docs);
//   //  console.log("here4")
    
//     const data = await pdfjs.getDocument({ data: buffer }).promise;
//     const docs = await pdfjs.getDocument(pdfURL).promise;
//     const splitter = new RecursiveCharacterTextSplitter();
//     const splitDocs = await splitter.splitDocuments(docs);
//     return splitDocs;

//     return splitDocs;
// }

// import { PDFDocument } from 'pdf-lib';
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export const extractTextFromPdf = async (buffer: ArrayBuffer) => {
  // import { PDFLoader } from "langchain/document_loaders/fs/pdf";
  // Or, in web environments:
  const blob = new Blob([buffer]); // e.g. from a file input
  const loader = new WebPDFLoader(blob);
  
  // const loader = new PDFLoader("src/document_loaders/example_data/example.pdf");
  
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  return splitDocs;
};