import 'package:flutter/foundation.dart';
import '../models/portfolio_item.dart';
import '../models/company_info.dart';
import '../services/data_service.dart';

class PortfolioProvider extends ChangeNotifier {
  List<PortfolioItem> _portfolios = [];
  CompanyInfo? _companyInfo;

  List<PortfolioItem> get portfolios => _portfolios;
  CompanyInfo? get companyInfo => _companyInfo;

  PortfolioProvider() {
    loadData();
  }

  Future<void> loadData() async {
    _portfolios = DataService.getAllPortfolios();
    _companyInfo = DataService.getCompanyInfo();
    notifyListeners();
  }

  Future<void> addPortfolio(PortfolioItem item) async {
    await DataService.addPortfolio(item);
    await loadData();
  }

  Future<void> updatePortfolio(int index, PortfolioItem item) async {
    await DataService.updatePortfolio(index, item);
    await loadData();
  }

  Future<void> deletePortfolio(int index) async {
    await DataService.deletePortfolio(index);
    await loadData();
  }

  Future<void> updateCompanyInfo(CompanyInfo info) async {
    await DataService.updateCompanyInfo(info);
    await loadData();
  }

  PortfolioItem? getPortfolioById(String id) {
    return DataService.getPortfolioById(id);
  }
}
