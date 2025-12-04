import 'package:flutter/foundation.dart';
import '../models/portfolio_item.dart';
import '../models/company_info.dart';
import '../models/investment_notice.dart';
import 'data_service_web.dart' if (dart.library.io) 'data_service.dart';

/// Unified facade for data service operations
/// Automatically routes to correct implementation based on platform
class DataServiceFacade {
  static Future<void> initialize() async {
    if (kIsWeb) {
      await DataServiceWeb.initialize();
    } else {
      await DataService.initialize();
    }
  }

  static List<PortfolioItem> getAllPortfolios() {
    if (kIsWeb) {
      return DataServiceWeb.getAllPortfolios();
    } else {
      return DataService.getAllPortfolios();
    }
  }

  static PortfolioItem? getPortfolioById(String id) {
    if (kIsWeb) {
      return DataServiceWeb.getPortfolioById(id);
    } else {
      return DataService.getPortfolioById(id);
    }
  }

  static Future<void> addPortfolio(PortfolioItem item) async {
    if (kIsWeb) {
      await DataServiceWeb.addPortfolio(item);
    } else {
      await DataService.addPortfolio(item);
    }
  }

  static Future<void> updatePortfolio(int index, PortfolioItem item) async {
    if (kIsWeb) {
      await DataServiceWeb.updatePortfolio(index, item);
    } else {
      await DataService.updatePortfolio(index, item);
    }
  }

  static Future<void> deletePortfolio(int index) async {
    if (kIsWeb) {
      await DataServiceWeb.deletePortfolio(index);
    } else {
      await DataService.deletePortfolio(index);
    }
  }

  static CompanyInfo? getCompanyInfo() {
    if (kIsWeb) {
      return DataServiceWeb.getCompanyInfo();
    } else {
      return DataService.getCompanyInfo();
    }
  }

  static Future<void> updateCompanyInfo(CompanyInfo info) async {
    if (kIsWeb) {
      await DataServiceWeb.updateCompanyInfo(info);
    } else {
      await DataService.updateCompanyInfo(info);
    }
  }

  static InvestmentNotice? getInvestmentNotice() {
    if (kIsWeb) {
      return DataServiceWeb.getInvestmentNotice();
    } else {
      return DataService.getInvestmentNotice();
    }
  }

  static List<InvestmentNotice> getAllInvestmentNotices() {
    if (kIsWeb) {
      return DataServiceWeb.getAllInvestmentNotices();
    } else {
      return DataService.getAllInvestmentNotices();
    }
  }

  static Future<void> addInvestmentNotice(InvestmentNotice notice) async {
    if (kIsWeb) {
      await DataServiceWeb.addInvestmentNotice(notice);
    } else {
      await DataService.addInvestmentNotice(notice);
    }
  }

  static Future<void> updateInvestmentNotice(int index, InvestmentNotice notice) async {
    if (kIsWeb) {
      await DataServiceWeb.updateInvestmentNotice(index, notice);
    } else {
      await DataService.updateInvestmentNotice(index, notice);
    }
  }

  static Future<void> deleteInvestmentNotice(int index) async {
    if (kIsWeb) {
      await DataServiceWeb.deleteInvestmentNotice(index);
    } else {
      await DataService.deleteInvestmentNotice(index);
    }
  }
}
