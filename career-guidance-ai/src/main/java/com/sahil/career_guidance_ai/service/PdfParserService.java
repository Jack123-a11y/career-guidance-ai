package com.sahil.career_guidance_ai.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class PdfParserService {

    public String extractText(File pdfFile) throws IOException {

        PDDocument document = Loader.loadPDF(pdfFile);

        PDFTextStripper pdfTextStripper = new PDFTextStripper();

        String text = pdfTextStripper.getText(document);

        document.close();

        return text;
    }
}