import 'package:flutter/foundation.dart';
import '../models/portfolio_item.dart';
import '../models/company_info.dart';
import '../services/data_service_web.dart';

class PortfolioProvider extends ChangeNotifier {
  List<PortfolioItem> _portfolios = [];
  CompanyInfo? _companyInfo;

  List<PortfolioItem> get portfolios => _portfolios;
  CompanyInfo? get companyInfo => _companyInfo;

  PortfolioProvider() {
    loadData();
  }

  Future<void> loadData() async {
    debugPrint('🔄 PortfolioProvider: Loading data...');
    _portfolios = DataServiceWeb.getAllPortfolios();
    _companyInfo = DataServiceWeb.getCompanyInfo();
    debugPrint('✅ PortfolioProvider: Loaded ${_portfolios.length} portfolios');
    notifyListeners();
    debugPrint('✅ PortfolioProvider: Listeners notified');
  }

  Future<void> addPortfolio(PortfolioItem item) async {
    debugPrint('➕ PortfolioProvider: Adding portfolio "${item.title}"');
    await DataServiceWeb.addPortfolio(item);
    debugPrint('🔄 PortfolioProvider: Reloading data after add...');
    await loadData();
  }

  Future<void> updatePortfolio(int index, PortfolioItem item) async {
    await DataServiceWeb.updatePortfolio(index, item);
    await loadData();
  }

  Future<void> deletePortfolio(int index) async {
    await DataServiceWeb.deletePortfolio(index);
    await loadData();
  }

  Future<void> updateCompanyInfo(CompanyInfo info) async {
    await DataServiceWeb.updateCompanyInfo(info);
    await loadData();
  }

  PortfolioItem? getPortfolioById(String id) {
    return DataServiceWeb.getPortfolioById(id);
  }
}
