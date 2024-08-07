package com.zionex.t3series.web.util.excel;

import javax.servlet.http.HttpServletRequest;
/*
import java.awt.font.FontRenderContext;
import java.awt.font.LineBreakMeasurer;
import java.awt.font.TextAttribute;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import java.text.AttributedString;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;

import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.ShapeTypes;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.Units;
import org.apache.poi.xssf.usermodel.IndexedColorMap;
import org.apache.poi.xssf.usermodel.XSSFCell;

import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFRow;


import org.apache.poi.xssf.usermodel.XSSFSimpleShape;
import org.apache.poi.xssf.usermodel.XSSFTextBox;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.awt.Color;
*/
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.springframework.stereotype.Component;
import org.json.simple.JSONObject;

/**
 * excel exporter template.
 * 
 */
@Component
public class DefExcelExporter implements ExcelExporter {

    @Override
    public ExcelContext handle(String fileName, JSONObject params, HttpServletRequest request) {

        String sheetName = fileName;
        ExcelContext excel = new ExcelContext();
        XSSFSheet sheet = excel.addSheet(sheetName);

        String headerBgColor = "#6128B1";
        String headerFontColor = "#ffffff";

        XSSFCellStyle headCellStyle = excel.createCellStyle(sheet, headerBgColor, true);
        XSSFCellStyle bodyCellStyle = excel.createCellStyle(sheet, "#ffffff", true);

        excel.setFontColor(sheet, headCellStyle, headerFontColor);
        int colCnt = 10;
        int headRow = 1;
        int dataRow = 100;
        for (int colIdx = 0; colIdx < colCnt; colIdx++) {
            for (int h = 0; h < headRow; h++) {
                excel.setCell(sheet, colIdx, h, headCellStyle, "col" + colIdx);
            }
        }

        for (int c = 0; c < colCnt; c++) {
            for (int h = 0; h < dataRow; h++) {
                excel.setCell(sheet, c, headRow + h, bodyCellStyle, "col" + c);
            }
        }

        return excel;
    }
}
