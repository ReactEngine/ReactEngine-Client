'use strict'

var React = require('react-native')

var {
  ListView,
  Platform,
  TouchableHighlight,
  View,
  Text,
  ScrollView,
  PullToRefreshViewAndroid
} = React

var TableView = require('react-native-tableview');
var Section = TableView.Section;
var Item = TableView.Item;
var Cell = TableView.Cell;
var Header = TableView.Header;
var Footer = TableView.Footer;

import defaultStyles from './default.styles'

// small helper function which merged two objects into one
function MergeRecursive(obj1, obj2) {
  for (var p in obj2) {
    try {
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p])
      } else {
        obj1[p] = obj2[p]
      }
    } catch(e) {
      obj1[p] = obj2[p]
    }
  }
  return obj1
}

var GiftedSpinner = require('react-native-gifted-spinner')

var GiftedListView = React.createClass({

  componentWillReceiveProps(props) {
    const fetchedData = props.fetchedData || {}
    const fetchOptions = props.fetchOptions || {}
    //console.log("listview/componentWillReceiveProps fetchedData:",fetchedData," fetchOptions:",fetchOptions)
    if(fetchOptions.paginate){
      this._postPaginate(fetchedData,fetchOptions)
    }else{
      this._postRefresh(fetchedData,fetchOptions)
    }
  },

  getDefaultProps() {
    return {
      customStyles: {},
      initialListSize: 10,
      firstLoader: true,
      pagination: true,
      refreshable: true,
      refreshableViewHeight: 50,
      refreshableDistance: 40,
      headerView: null,
      sectionHeaderView: null,
      withSections: false,
      autoPaginate: false,
      onFetch(page, callback, options) { callback([]) },

      paginationFetchingView: null,
      paginationAllLoadedView: null,
      paginationWaitingView: null,
      refreshableFetchingView: null,
      refreshableWillRefreshView: null,
      refreshableWaitingView: null,
      emptyView: null,
      renderSeparator: null,
      PullToRefreshViewAndroidProps: {
        colors: ['#000000'],
        progressBackgroundColor: '#c8c7cc',
      },
    }
  },

  propTypes: {
    customStyles: React.PropTypes.object,
    initialListSize: React.PropTypes.number,
    firstLoader: React.PropTypes.bool,
    pagination: React.PropTypes.bool,
    refreshable: React.PropTypes.bool,
    refreshableViewHeight: React.PropTypes.number,
    refreshableDistance: React.PropTypes.number,
    headerView: React.PropTypes.func,
    sectionHeaderView: React.PropTypes.func,
    withSections: React.PropTypes.bool,
    autoPaginate: React.PropTypes.bool,
    onFetch: React.PropTypes.func,

    paginationFetchingView: React.PropTypes.func,
    paginationAllLoadedView: React.PropTypes.func,
    paginationWaitingView: React.PropTypes.func,
    refreshableFetchingView: React.PropTypes.func,
    refreshableWillRefreshView: React.PropTypes.func,
    refreshableWaitingView: React.PropTypes.func,
    emptyView: React.PropTypes.func,
    renderSeparator: React.PropTypes.func,
    PullToRefreshViewAndroidProps: React.PropTypes.object,
  },

  _setY(y) { this._y = y },
  _getY(y) { return this._y },
  _setPage(page) { this._page = page },
  _getPage() { return this._page },
  _setRows(rows) { this._rows = rows },
  _getRows() { return this._rows },


  paginationFetchingView() {
    if (this.props.paginationFetchingView) {
      return this.props.paginationFetchingView()
    }

    return (
      <View style={[defaultStyles.paginationView, this.props.customStyles.paginationView]}>
        <GiftedSpinner />
      </View>
    )
  },
  paginationAllLoadedView() {
    if (this.props.paginationAllLoadedView) {
      return this.props.paginationAllLoadedView()
    }

    return (
      <View style={[defaultStyles.paginationView, this.props.customStyles.paginationView]}>
        <Text style={[defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
          No More...
        </Text>
      </View>
    )
  },
  paginationWaitingView(paginateCallback) {
    if (this.props.paginationWaitingView) {
      return this.props.paginationWaitingView(paginateCallback)
    }

    return (
      <TouchableHighlight
        underlayColor='#c8c7cc'
        onPress={paginateCallback}
        style={[defaultStyles.paginationView, this.props.customStyles.paginationView]}
      >
        <Text style={[defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
          Load more
        </Text>
      </TouchableHighlight>
    )
  },
  headerView() {
    if (this.state.paginationStatus === 'firstLoad' || !this.props.headerView){
      return null
    }
    return this.props.headerView()
  },
  refreshableFetchingView() {
    if (this.props.refreshableFetchingView) {
      return this.props.refreshableFetchingView()
    }
    return (
      <View>
        <View style={[defaultStyles.refreshableView, this.props.customStyles.refreshableView]}>
          <GiftedSpinner />
        </View>
        {this.headerView()}
      </View>
    )
  },
  refreshableWillRefreshView() {
    if (this.props.refreshableWillRefreshView) {
      return this.props.refreshableWillRefreshView()
    }

    return (
      <View>
        <View style={[defaultStyles.refreshableView, this.props.customStyles.refreshableView]}>
          <Text style={[defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
            ↻
          </Text>
        </View>
        {this.headerView()}
      </View>
    )
  },
  refreshableWaitingView(refreshCallback) {
    if (this.props.refreshableWaitingView) {
      return this.props.refreshableWaitingView(refreshCallback)
    }

    return (
      <View>
          <View style={[defaultStyles.refreshableView, this.props.customStyles.refreshableView]}>
            <Text style={[defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
              ↓
            </Text>
          </View>
        {this.headerView()}
      </View>
    )
  },
  emptyView(refreshCallback) {
    if (this.props.emptyView) {
      return this.props.emptyView(refreshCallback)
    }

    return (
      <View style={[defaultStyles.defaultView, this.props.customStyles.defaultView]}>
        <Text style={[defaultStyles.defaultViewTitle, this.props.customStyles.defaultViewTitle]}>
          Sorry, there is no content to display
        </Text>

        <TouchableHighlight
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
        >
          <Text>
            ↻
          </Text>
        </TouchableHighlight>
      </View>
    )
  },
  renderSeparator() {
    if (this.props.renderSeparator) {
      return this.props.renderSeparator()
    }

    return (
      <View style={[defaultStyles.separator, this.props.customStyles.separator]} />
    )
  },
  onEndReached() {
      if (this.props.autoPaginate) {
        this._onPaginate();
      }
      if (this.props.onEndReached) {
        this.props.onEndReached();
      }
    },
  getInitialState() {

    if (this.props.refreshable === true && Platform.OS !== 'android') {
      this._setY(this.props.refreshableViewHeight)
    } else {
      this._setY(0)
    }

    this._setPage(1)
    this._setRows([])

    var ds = null
    if (this.props.withSections === true) {
      ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
      })
      return {
        dataSource: ds.cloneWithRowsAndSections(this._getRows()),
        refreshStatus: 'waiting',
        isRefreshing: false,
        paginationStatus: 'firstLoad',
      }
    } else {
      ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
      return {
        dataSource: ds.cloneWithRows(this._getRows()),
        refreshStatus: 'waiting',
        isRefreshing: false,
        paginationStatus: 'firstLoad',
      }
    }
  },

  componentDidMount() {
    this._scrollResponder = this.refs.listview.getScrollResponder()
    this.props.onFetch(this._getPage(), {firstLoad: true})
  },

  setNativeProps(props) {
    this.refs.listview.setNativeProps(props)
  },

  _refresh() {
    this._onRefresh({external: true})
  },

  _onRefresh(options = {}) {
    if (this.isMounted()) {
      this._scrollResponder.scrollTo({y: 0})
      this.setState({
        refreshStatus: 'fetching',
        isRefreshing: true,
      })
      this._setPage(1)
      this.props.onFetch(this._getPage(), options)
    }
  },

  _postRefresh(rows = [], options = {}) {
    //console.log("listview/_postRefresh rows:",rows," options:",options)
    if (this.isMounted()) {
      this._updateRows(rows, options)
      if (this.props.refreshable === true && Platform.OS !== 'android') {
        // @issue
        // if a scrolling is already in progress, this scroll will not be executed
        this._scrollResponder.scrollTo({y: this.props.refreshableViewHeight})
      }
    }
  },

  _onPaginate() {
    // this.setState({
    //   paginationStatus: 'fetching',
    // })
    // this.props.onFetch(this._getPage() + 1, this._postPaginate, {})
    if (this.state.paginationStatus === 'firstLoad'
     || this.state.paginationStatus === 'waiting') {
       this.setState({
         paginationStatus: 'fetching',
       });
       this.props.onFetch(this._getPage() + 1, { paginate:true});
     }
  },

  _postPaginate(rows = [], options = {}) {
    this._setPage(this._getPage() + 1)
    var mergedRows = null
    if (this.props.withSections === true) {
      mergedRows = MergeRecursive(this._getRows(), rows)
    } else {
      mergedRows = this._getRows().concat(rows)
    }
    this._updateRows(mergedRows, options)
  },

  _updateRows(rows = [], options = {}) {
    if (rows !== null) {
      this._setRows(rows)
      if (this.props.withSections === true) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(rows),
          refreshStatus: 'waiting',
          isRefreshing: false,
          paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
        })
      } else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rows),
          refreshStatus: 'waiting',
          isRefreshing: false,
          paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
        })
      }
    } else {
      this.setState({
        refreshStatus: 'waiting',
        isRefreshing: false,
        paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
      })
    }
  },

  _onResponderRelease() {
    if (this.props.refreshable === true) {
      if (Platform.OS !== 'android') {
        if (this.state.refreshStatus === 'willRefresh') {
          this._onRefresh()
        }
      }
    }
  },

  _onScroll(e) {
    // console.log("onScroll: "+JSON.stringify(e));
    this._setY(e.nativeEvent.contentOffset.y)
    if (this.props.refreshable === true) {
      if (Platform.OS !== 'android') {
        if (this._getY() < this.props.refreshableViewHeight - this.props.refreshableDistance
        && this.state.refreshStatus === 'waiting'
        && this._scrollResponder.scrollResponderHandleScrollShouldSetResponder() === true
      ) {
          console.log("will refresh");
          this.setState({
            refreshStatus: 'willRefresh',
            isRefreshing: false,
          })
        }
      }
    }
  },

  _renderRefreshView() {
    switch (this.state.refreshStatus) {
      case 'fetching':
        return this.refreshableFetchingView()
        break
      case 'willRefresh':
        return this.refreshableWillRefreshView()
        break
      default:
        return this.refreshableWaitingView(this._onRefresh)
    }
  },

  _renderPaginationView() {
    if ((this.state.paginationStatus === 'fetching' && this.props.pagination === true) || (this.state.paginationStatus === 'firstLoad' && this.props.firstLoader === true)) {
      return this.paginationFetchingView()
    } else if (this.state.paginationStatus === 'waiting' && this.props.pagination === true && (this.props.withSections === true || this._getRows().length > 0)) {
      return this.paginationWaitingView(this._onPaginate)
    } else if (this.state.paginationStatus === 'allLoaded' && this.props.pagination === true) {
      return this.paginationAllLoadedView()
    } else if (this._getRows().length === 0) {
      return this.emptyView(this._onRefresh)
    } else {
      return null
    }
  },

  _calculateContentInset() {
    if (this.props.refreshable === true && Platform.OS !== 'android') {
      return {top: -1 * this.props.refreshableViewHeight, bottom: 0, left: 0, right: 0}
    } else {
      return {top: 0, bottom: 0, left: 0, right: 0}
    }
  },

  _calculateContentOffset() {
    if (this.props.refreshable === true && Platform.OS !== 'android') {
      return {x: 0, y: this.props.refreshableViewHeight}
    } else {
      return {x: 0, y: 0}
    }
  },

  _renderItem(item, sectionIdx, rowIdx) {
    var comboID = sectionIdx + '_' + rowIdx;
    return (<Item key={'r_' + comboID} label={item.text}></Item>);
  },

  _onPress(event) {
    var rowData = this.state.dataSource.getRowData(event.selectedSection, event.selectedIndex);
    if (this.props.onPress) {
      this.props.onPress(rowData);
    }
  },

  renderListView(style = {}) {

    var dataSource = this.state.dataSource;
    var allRowIDs = dataSource.rowIdentities;
    var sections = [];

    // var header = <Header>{this.props.refreshable === true && Platform.OS !== 'android' ? this._renderRefreshView() : this.headerView()}</Header>;
    // var footer = <Footer>{this._renderPaginationView()}</Footer>;
    // debugger
    for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
      var sectionID = dataSource.sectionIdentities[sectionIdx];
      var rowIDs = allRowIDs[sectionIdx];

      var renderItem = this.props.rowView ? this.props.rowView : this._renderItem;

      // renderItem
      var items = [];
      for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
        var rowID = rowIDs[rowIdx];
        var comboID = sectionID + '_' + rowID;
        // var shouldUpdateRow = rowCount >= this._prevRenderedRowsCount &&
        // dataSource.rowShouldUpdate(sectionIdx, rowIdx);
        var rowData = dataSource.getRowData(sectionIdx, rowIdx);
        var item = renderItem(rowData, sectionIdx, rowIdx);
        items.push(item);
      }

      var sctData = dataSource.getSectionHeaderData(sectionIdx);
      var sct = (<Section key={'s_' + sectionID} label={sctData.text} arrow={true}>
                  {items}
                </Section>);
      sections.push(sct)
    }

    return (
      <TableView ref="listview"
                 scrollEventThrottle={200}
                 contentInset={this._calculateContentInset()}
                 contentOffset={this._calculateContentOffset()}
                 automaticallyAdjustContentInsets={false}
                 scrollEnabled={true}
                 canCancelContentTouches={true}
                 onScroll={this.props.refreshable === true && Platform.OS !== 'android' ? this._onScroll : null}
                 onResponderRelease={this.props.refreshable === true && Platform.OS !== 'android' ? this._onResponderRelease : null}
                 {...this.props}
                 style={[this.props.style, style]}
                 onPress={this._onPress}
                 //  refreshControl={this._renderRefreshControl()}
                 //  dataSource={this.state.dataSource}
                 //  renderRow={this.props.rowView}
                 //  renderSectionHeader={this.props.sectionHeaderView}
                 //  renderHeader={this.props.refreshable === true && Platform.OS !== 'android' ? this._renderRefreshView : this.headerView}
                 //  renderFooter={this._renderPaginationView}
                 //  renderSeparator={this.renderSeparator}
                 //  onEndReached={this.onEndReached}
                 >
          <Header>
            {this.props.refreshable === true && Platform.OS !== 'android' ? this._renderRefreshView() : this.headerView()}
          </Header>
          {sections}
          <Footer>
            {this._renderPaginationView()}
          </Footer>
      </TableView>

      // <ListView
      //   ref="listview"
      //   dataSource={this.state.dataSource}
      //   renderRow={this.props.rowView}
      //   renderSectionHeader={this.props.sectionHeaderView}
      //
      //   renderHeader={this.props.refreshable === true && Platform.OS !== 'android' ? this._renderRefreshView : this.headerView}
      //   renderFooter={this._renderPaginationView}
      //
      //   onScroll={this.props.refreshable === true && Platform.OS !== 'android' ? this._onScroll : null}
      //   onResponderRelease={this.props.refreshable === true && Platform.OS !== 'android' ? this._onResponderRelease : null}
      //
      //   scrollEventThrottle={200}
      //
      //   contentInset={this._calculateContentInset()}
      //   contentOffset={this._calculateContentOffset()}
      //
      //   automaticallyAdjustContentInsets={false}
      //   scrollEnabled={true}
      //   canCancelContentTouches={true}
      //
      //   renderSeparator={this.renderSeparator}
      //
      //   onEndReached={this.onEndReached}
      //
      //   {...this.props}
      //
      //   style={[this.props.style, style]}
      // />
    );
  },

  render() {
    //console.log("listview render,state:",this.state)
    if (Platform.OS === 'android' && this.props.refreshable === true) {
      return (
        <PullToRefreshViewAndroid
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}

          {...this.props.PullToRefreshViewAndroidProps}

          style={[this.props.PullToRefreshViewAndroidProps.style, {flex: 1}]}
        >
          {this.renderListView({flex: 1})}
        </PullToRefreshViewAndroid>
      )
    } else {
      return this.renderListView()
    }
  },


})


module.exports = GiftedListView
