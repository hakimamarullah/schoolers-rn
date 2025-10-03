import { namespaces } from "./i18n.constants";


const { pages, components, common, functions } = namespaces;

export const id = {
  [common]: {
    buttons: {
      ok: "Ok",
      cancel: "Batal",
    },
    logout: "Keluar"
  },
  [functions] : {
      errorParsingCSV: "CSV harus pakai headers: raw_message, sender, timestamp"
  },
  [pages.importSMSPage]: {
    headers: {
       title: "Impor SMS",
       subtitle: "Unggah pesan SMS banking Kamu untuk mengambil data transaksi"
    },
    importStatusMessage: {
      success: "Yeayy berhasil impor {{counts}} SMS! Transaksi akan segera ditambahkan. Mohon bersabar ya!",
      allImportFailed: "Waduh, tidak ada impor yang berhasil! Coba lagi ya!",
      unknownError: "Waduh gagal impor: {{additionalMessage}}"
    },
    importSuccessful: "Impor Berhasil!",
    importFailed: "Impor Gagal!",
    importSMSMessages: "Impor SMS",
    uploadYourCSVFileWithSMSBanking: "Unggah SMS dalam format file CSV untuk mengekstrak transaksi secara otomatis.",
    dropYourFileHere: "Drop file kamu di sini",
    clickToUpload: "Klik untuk mengunggah",
    orDragAndDrop: " atau drag and drop",
    csvFileWithColumn: "file CSV dengan kolom raw_message, sender, timestamp",
    csvFormatRequirements: "Format file CSV:",
    supportedBanks: "Bank yang didukung: BCA, BNI, BRI, Mandiri, OVO, and 9 lainnya",
    timestampFormat: "Format timestamp: ISO 8601 (e.g., 2025-01-17T08:23:00+07:00)",
    maximum100Messages: "Maksimum 100 pesan per batch",
    havingIssues: "Ada masalah? Cek halaman",
    aiccountantDashboard: "dashboard Aiccountant",
    toMonitorTransactionsStatus: "untuk memonitor transaksi kamu.",
    csvParsingError: "Gagal memproses file: {{additionalMessage}}",
    pleaseSelectCsvFile: "Tolong pakai file CSV ya!"
  },
  [pages.transactionsPage]: {
    headers: {
      title: "Transaksi",
      subtitle: "Lihat Transaksi yang Sudah Kamu Impor"
    }
  },
  [components.sidebar] : {
     menu: {
       transactions: "Transaksi",
       importSMS: "Impor SMS"
     }
  },
  [components.transactionList] : {
    headers: {
       title: "Transaksi Terbaru",
       show: "Tampilkan:",
       perPage: "Per Halaman"
    },
    showing: "Menampilkan",
    transaction: "Transaksi",
    transactions: "Transaksi",
    refreshTransaction: "Muat Ulang Transaksi",
    noTransactionsFoundMatchingYourFilter: "Tidak ada transaksi yang ditemukan dengan kriteria yang kamu gunakan.",
    noTransactionFoundImportSMSToGetStarted: "Tidak ada transaksi. Mulai impor SMS sekarang yuk!",
    clearFilter: "Hapus Filter"

  },
  [components.transactionFilter] : {
    filterTransaction: "Filter Transaksi",
    startDate: "Tanggal Mulai",
    endDate: "Tanggal Akhir",
    reviewStatus: "Status Tinjauan",
    allTransactions: "Semua transaksi",
    reviewedOnly: "Sudah ditinjau",
    notReviewedOnly: "Belum ditinjau",
    resetFilter: "Reset Filters",
    applyFilter: "Gunakan Filter"
  },
  [components.csvPreview] : {
    totalMessages: "Total Pesan",
    validMessages: "Pesan Sesuai",
    invalidMessages: "Pesan Salah",
    importingMessagesLoading: "Impor {{length}} pesan...",
    importingMessages: "Impor {{length}} pesan valid"
  }
};

export const en = {
  [common]: {
    buttons: {
      ok: "Ok",
      cancel: "Cancel",
    },
    logout: "Logout"
  },
  [functions] : {
      errorParsingCSV: "CSV must have headers: raw_message, sender, timestamp"
  },
  [pages.importSMSPage]: {
    headers: {
      title: "Import SMS",
      subtitle: "Upload your SMS banking messages to extract transactions"
    },
    importStatusMessage: {
      success: "Successfully imported {{counts}} messages! Transactions will appear after processing (usually within a few minutes).",
      allImportFailed: "Something went wrong. Please try again!",
      unknownError: "Something went wrong: {{additionalMessage}}"
    },
    importSuccessful: "Import Successfull!",
    importFailed: "Import Failed!",
    importSMSMessages: "Import SMS",
    uploadYourCSVFileWithSMSBanking: "Upload your CSV file with SMS banking messages to automatically extract transactions.",
    dropYourFileHere: "Drop your file here",
    clickToUpload: "Click to upload",
    orDragAndDrop: " or drag and drop",
    csvFileWithColumn: "CSV files with raw_message, sender, timestamp columns",
    csvFormatRequirements: "CSV Format Requirements:",
    supportedBanks: "Supported banks: BCA, BNI, BRI, Mandiri, OVO, and 9 more",
    timestampFormat: "Timestamp format: ISO 8601 (e.g., 2025-01-17T08:23:00+07:00)",
    maximum100Messages: "Maximum 100 messages per batch",
    havingIssues: "Having issues? Check the",
    aiccountantDashboard: "Aiccountant dashboard",
    toMonitorTransactionsStatus: "to monitor your transaction status.",
    csvParsingError: "File parsing error: {{additionalMessage}}",
    pleaseSelectCSVFile: "Please select a CSV file"

  },
  [pages.transactionsPage]: {
    headers: {
      title: "Transactions",
      subtitle: "View your imported transactions"
    }
  },
  [components.sidebar] : {
     menu: {
       transactions: "Transactions",
       importSMS: "Import SMS"
     }
  },
  [components.transactionList] : {
    headers: {
      title: "Recent Transactions",
      show: "Show:",
      perPage: "Per Page"
    },
    showing: "Showing",
    transaction: "Transaction",
    transactions: "Transactions",
    refreshTransaction: "Refresh Transaction",
    noTransactionsFoundMatchingYourFilter: "No transactions found matching your filters.",
    noTransactionFoundImportSMSToGetStarted: "No transactions found. Import some SMS messages to get started!",
    clearFilter: "Clear Filters"
  },
  [components.transactionFilter] : {
    filterTransaction: "Filter Transactions",
    startDate: "Start Date",
    endDate: "End Date",
    reviewStatus: "Review Status",
    allTransactions: "All Transactions",
    reviewedOnly: "Reviewed only",
    notReviewedOnly: "Not reviewed only",
    resetFilter: "Reset Filters",
    applyFilter: "Apply Filter"
  },
  [components.csvPreview] : {
    totalMessages: "Total Messages",
    validMessages: "Valid Messages",
    invalidMessages: "Invalid Messages",
    importingMessagesLoading: "Importing {{length}} messages...",
    importingMessages: "Importing {{length}} valid messages"
  }
};
