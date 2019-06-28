// global angular

var app = angular.module('selene', [
    'ui.bootstrap',
    'ngFileUpload',
    'ngTagsInput',
    'ngMask',
    'oc.lazyLoad',
    'summernote',
    'monospaced.elastic',
    'localytics.directives',
    'vsGoogleAutocomplete',
    'templates',
    'uib-templates',
    'infinite-scroll',
    'seleneInterceptor',
    'selector'
]);

// ReSharper disable UsingOfReservedWord
app.config(['$ocLazyLoadProvider', '$uibTooltipProvider', function ($ocLazyLoadProvider, $uibTooltip) {

    $uibTooltip.options({
        placement: 'bottom'
    });

    $ocLazyLoadProvider.config({
        'events': true, 
        'modules': [{
            name: 'summernote',
            serie: true,
            cache: true,
            files: [
                'assets/lib/bootstrap.min.js',
                'assets/lib/summernote.css',
                'assets/lib/summernote.min.js'
            ]
        },
        {
            name: 'admin',
            serie: true,
            cache: true,
            files: [
                'assets/lib/chart.bundle.min.js',
                'assets/lib/angular-chart.js',
                'assets/lib/smart-table.min.js'
            ]
        }]
    });
}]);

app.run(function($rootScope, $http) {
    $rootScope.ENVIRONMENT = window.location.hostname;

    $http.defaults.headers.common['X-XSRF-Token'] = angular.element('input[name="__RequestVerificationToken"]').attr('value');
});

angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('template/lists/delete.html','<div class="widget"><div class="widget-header bgm-red">Are you sure?<ul class="actions actions-alt"><li><a ng-click="listCtrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><p class="text-center giant"><i class="mdi mdi-alert c-red"></i></p><p class="text-center">Deleting this list is permanent and cannot be recovered.</p><p class="card-commands m-t-20 text-danger" ng-if="listCtrl.message" ng-bind-html="listCtrl.cleanHtml(ctrl.message)"></p></div><div class="widget-actions bgm-red"><button class="action text-left" ng-click="listCtrl.close()" ng-disabled="listCtrl.working"><i class="mdi mdi-block-helper"></i> Cancel</button> <button class="action text-right" ng-click="listCtrl.delete()" ng-disabled="listCtrl.working">Delete <i class="mdi" ng-class="listCtrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-check\'"></i></button></div></div>');
$templateCache.put('template/lists/details.html','<div class="widget" ng-if="ctrl.list" ng-cloak><div class="widget-header styled">{{ctrl.list.name}}<ul class="actions actions-alt" ng-if="ctrl.isSelf"><li uib-dropdown><a href="" uib-dropdown-toggle class="dropdown-toggle" aria-haspopup="true" uib-tooltip="settings"><i class="mdi mdi-settings"></i></a><ul class="dropdown-menu dropdown-menu-right"><li ng-click="ctrl.edit()"><a href=""><i class="mdi mdi-pencil"></i> Edit</a></li><li ng-click="ctrl.confirm()"><a href=""><i class="mdi mdi-delete"></i> Delete</a></li></ul></li></ul><div ng-if="!ctrl.isSelf"><button class="action btn btn-inverse bgm-amber" ng-if="ctrl.list.isFollowing" ng-click="ctrl.follow()"><i class="mdi mdi-check"></i> Following</button> <button class="action btn btn-inverse bgm-amber" ng-if="!ctrl.list.isFollowing" ng-click="ctrl.follow()">Follow</button></div></div><div class="widget-more bgm-blue"><a class="pointer" ng-click="ctrl.share()" ng-if="ctrl.isSelf"><i class="mdi mdi-share"></i> Share this list with friends!</a></div><div class="widget-content"><span ng-if="ctrl.list.description">{{ctrl.list.description}}</span> <strong ng-if="!ctrl.list.description">No Description <span><br><br>Click the <i class="mdi mdi-settings"></i> button to add one.</span></strong><hr><div ng-if="1 === 0"><div class="widget-info">Categories</div><div ng-if="!ctrl.list.categories">You have no categories for this list. Categories help break up items into groups like price ranges, types, etc.</div><ul class="list-nav" ng-if="ctrl.list.categories"><li ng-click="ctrl.filter(null)"><a class="pointer" ng-class="{ \'active\' : !ctrl.list }">All Categories</a></li><li ng-repeat="c in ctrl.list.categories" ng-click="ctrl.filter(list)"><a class="pointer">{{c.value}}</a></li></ul><hr></div><div class="widget-info"><i class="mdi mdi-clock"></i> Created <strong class="pull-right">{{ctrl.calcDate(ctrl.list.createdDT)}}</strong></div><div class="widget-info m-t-10"><i class="mdi mdi-clock"></i> Updated <strong class="pull-right">{{ctrl.calcDate(ctrl.list.lastModifiedDT)}}</strong></div><div class="widget-info m-t-10" ng-if="ctrl.isSelf && ctrl.list.type === 1"><i class="mdi mdi-alert-circle-outline"></i> No Surprise: <strong class="pull-right">{{ctrl.list.data.noSurprise}}</strong></div></div></div>');
$templateCache.put('template/lists/editor.html','<div class="widget"><div class="widget-header bgm-amber"><span ng-if="!ctrl.list.id">Add a new {{ctrl.listTypes[ctrl.list.type]}}</span> <span ng-if="ctrl.list.id">Edit {{ctrl.listTypes[ctrl.list.type]}}</span><ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="form-group"><label class="control-label">Name</label><input type="text" class="form-control fc-boxed" ng-model="ctrl.list.name" placeholder="give it a name" maxlength="100"></div><div class="form-group"><label class="control-label">Description</label><textarea rows="3" class="form-control fc-boxed" ng-model="ctrl.list.description" maxlength="255" placeholder="tell everyone about it"></textarea><small>{{255 - ctrl.list.description.length}}/255 characters left</small></div><div ng-if="ctrl.list.type === 1"><label class="control-label small">Surprise me :)</label><div class="checkbox align"><label class="control-label"><input type="checkbox" ng-model="ctrl.list.data.noSurprise"> <i class="input-helper"></i> <small>We won\'t update you if someone marks an item on this list as purchased. That\'s half the fun right?</small></label></div></div><p class="m-t-20 text-danger" ng-if="ctrl.message" ng-bind-html="ctrl.cleanHtml(ctrl.message)"></p></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.close()" ng-disabled="ctrl.working"><i class="mdi mdi-block-helper"></i> Cancel</button> <button class="action text-right" ng-click="ctrl.save()" ng-disabled="ctrl.working">Save <i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-content-save\'"></i></button></div></div>');
$templateCache.put('template/lists/list.html','<div class="main" ng-cloak><div class="col-sidebar"><div class="widget"><div class="widget-header"><i class="mdi" ng-class="listsCtrl.text.icon"></i> {{listsCtrl.text.item}}</div><div class="widget-content"><ul class="list-nav"><li ng-click="listsCtrl.open()"><a class="pointer" ng-class="{ \'active\' : !listsCtrl.list }">All Items</a></li><li ng-repeat="list in listsCtrl.lists | filter: { following: false }" ng-if="!list.deleted" ng-click="listsCtrl.open(list)"><a class="pointer" ng-class="{ \'active\' : listsCtrl.list  && listsCtrl.list.id === list.id }">{{list.name}}</a></li></ul></div><div class="widget-more bgm-amber"><a class="pointer" ng-click="listsCtrl.add()" ng-if="listsCtrl.isSelf"><i class="mdi mdi-plus"></i> Add a new {{listsCtrl.text.single}}</a></div></div><div class="widget" ng-if="listsCtrl.hasFollowing"><div class="widget-header">Following</div><div class="widget-content"><ul class="list-nav"><li ng-repeat="list in listsCtrl.lists | filter: { following: true }" ng-if="!list.deleted" ng-click="listsCtrl.open(list)"><a class="pointer" ng-class="{ \'active\' : listsCtrl.list  && listsCtrl.list.id === list.id }">{{list.name}}<br><div class="small" style="margin-top: -5px">&nbsp; by {{list.user}}</div></a></li></ul></div></div></div><div class="main"><div class="col-main"><posts type="listsCtrl.type" init="true" mode="\'list\'"></posts></div><div class="col-sidebar hidden-sm"><list-details></list-details><list-categories></list-categories></div></div></div>');
$templateCache.put('template/modals/cardBox.html','<div class="auth-modal"><div class="auth-box no-modal" ng-class="cardBoxCtrl.cssClass"><div class="modal-content"><h3>{{cardBoxCtrl.title}} <small>{{cardBoxCtrl.subtitle}}</small></h3><div class="lb-c" ng-transclude></div></div></div></div>');
$templateCache.put('template/notifications/notificationHeader.html','<div><a class="c-white pointer" uib-dropdown-toggle ng-click="ctrl.clearNotifications()"><i class="mdi mdi-bell"></i> <i class="tmn-count" ng-if="ctrl.results.total">{{ctrl.results.total}}</i></a><div class="dropdown-menu dropdown-menu-lg p-t-0 p-b-0 stop-propagate pull-right" ng-if="ctrl.results.data.length"><div class="listview" id="notifications"><div class="lv-header">Notifications</div><div class="lv-body"><div ng-repeat="w in ctrl.results.data" ng-switch="w.type"><a ng-href="{{\'/settings/invite/\' + w.id}}" class="lv-item ng-scope" ng-switch-when="2"><div class="media"><div class="pull-left"><img alt="{{w.data.requestor}}" ng-src="{{\'/i/\' + w.sourceId + \'?size=s\'}}"></div><div class="media-body"><div class="lv-title ng-binding"><div class="pull-left">{{w.data.requestor}}</div><small class="pull-right">{{ctrl.calcDate(w.createdDT)}}</small></div><small class="lv-small ng-binding">Sent you a friend request.</small></div></div></a><a ng-href="{{\'/settings/share/\' + w.id}}" class="lv-item ng-scope" ng-switch-when="7"><div class="media"><div class="pull-left"><img alt="{{w.data.requestor}}" ng-src="{{\'/i/\' + w.sourceId + \'?size=s\'}}"></div><div class="media-body"><div class="lv-title ng-binding"><div class="pull-left">{{w.data.requestor}}</div><small class="pull-right">{{ctrl.calcDate(w.createdDT)}}</small></div><small class="lv-small ng-binding">Shared a list with you.</small></div></div></a></div></div><div class="clearfix"></div><a class="lv-footer" href="/settings/notifications">View Previous</a></div></div></div>');
$templateCache.put('template/notifications/notifications.html','<div class="main"><div class="col-sidebar"><div class="widget"><div class="widget-header"><i class="mdi mdi-bell"></i> Notifications</div><div class="widget-content"><ul class="list-nav"><li ng-click="ctrl.open()"><a class="pointer" ng-class="{ \'active\' : !ctrl.type }">All Items <span class="badge pull-right" ng-if="type.count">{{ctrl.total}}</span></a></li><li ng-repeat="type in ctrl.types" ng-click="ctrl.open(type)"><a class="pointer" ng-class="{ \'active\' : ctrl.type  && ctrl.type === type }">{{type.name}} <span class="badge pull-right" ng-if="type.count">{{type.count}}</span></a></li></ul></div></div></div><div class="main"><div class="col-main listview" infinite-scroll="ctrl.next()"><div class="widget" ng-if="!ctrl.results.data.length"><div class="widget-header">Nope, I\'ve got nothin\' for you at the moment</div><div class="widget-content"><p>It looks like you don\'t have any notifications at the moment.</p><p>That\'s ok though! We\'ll let you know as soon as you have some via the little "Bell" <i class="mdi mdi-bell"></i> icon up in the corner.</p></div></div><div class="lv-item widget p-0" ng-repeat="n in ctrl.results.data"><div class="widget-content" ng-switch="n.type"><a class="media clearfix" ng-switch-when="2" ng-href="{{\'/settings/confirm/\' + n.id}}"><div class="pull-left"><img alt="{{n.data.requestor}}" ng-src="{{\'/i/\' + n.sourceId + \'?size=s\'}}"></div><div class="media-body"><div class="lv-title ng-binding"><div class="pull-left">{{n.data.requestor}}</div><small class="pull-right">{{ctrl.calcDate(n.createdDT)}}</small></div><small class="lv-small ng-binding">Sent you a friend request.</small></div></a><div class="media clearfix" ng-switch-when="7"><div class="pull-left"><img alt="{{n.data.requestor}}" ng-src="{{\'/i/\' + n.sourceId + \'?size=s\'}}"></div><div class="media-body"><div class="lv-title ng-binding"><div class="pull-left">{{n.data.requestor}}</div><small class="pull-right">{{ctrl.calcDate(n.createdDT)}}</small></div><div class="c-black m-b-10">Shared their list: <strong>{{n.data.listName}}</strong> with you</div><a ng-href="/u/{{n.data.requestorUsername}}/wishlists?listId={{n.data.listId}}">View List</a> <span class="m-l-20 m-r-20">|</span> <a class="c-green" ng-href="{{\'/settings/share/\' + n.id}}">Accept/Decline</a></div></div></div></div></div><div class="col-sidebar"></div></div></div>');
$templateCache.put('template/posts/posts.html','<div class="posts" infinite-scroll="ctrl.load()" infinite-scroll-disable="ctrl.empty"><div class="widget p-r-10 p-l-10" ng-if="ctrl.mode === \'list\'"><div class="row"><div class="col-xs-9 p-t-10 p-b-10"><div class="form-group m-b-0"><input type="text" class="form-control" ng-model="ctrl.query" ng-change="ctrl.search()" ng-model-options="{ debounce: 300 }" placeholder="search items" maxlength="100"></div></div><div class="col-xs-3"><div class="form-group-sm m-b-0"><ul class="post-filter"><li uib-dropdown><a uib-dropdown-toggle aria-haspopup="true"><i class="mdi mdi-filter"></i> Filter / Sort</a><ul class="dropdown-menu dropdown-menu-right"><li><ul class="filters"><li>Filter by</li><li ng-class="{ \'active\' : o == ctrl.filter }" ng-repeat="o in ctrl.filters[ctrl.type]" ng-click="ctrl.filterBy(o)">{{o}}</li></ul></li><li><ul class="filters"><li>Sort by</li><li ng-class="{ \'active\' : o == ctrl.sort }" ng-repeat="o in ctrl.sorts[ctrl.type]" ng-click="ctrl.sortBy(o)">{{o}}</li></ul></li></ul></li></ul></div></div></div></div><div class="widget pointer waves w-100" ng-click="ctrl.add()" ng-if="ctrl.isSelf"><div class="widget-header text-center bgm-white c-black">Click here add a new <i class="mdi" ng-class="ctrl.text.icon"></i> {{ctrl.text.item}}.</div></div><div ng-repeat="post in ctrl.posts track by $index"><post post="post" mode="ctrl.mode"></post></div><div class="p-loading" ng-if="ctrl.working"><div>Loading...</div><i class="mdi mdi-autorenew mdi-spin"></i></div><div class="p-loading" ng-if="!ctrl.posts.length && !ctrl.working"><div>I couldn\'t find anything :(</div></div></div>');
$templateCache.put('template/profile/about.html','<div ng-if="ctrl.initialized"><div class="card"><div class="card-header border"><h2>A little about me.</h2><ul class="actions" ng-if="ctrl.isSelf && ctrl.profile.bio && !ctrl.editing"><li><a ng-click="ctrl.edit()"><i class="mdi mdi-pencil"></i></a></li></ul></div><div class="card-body card-padding"><div class="empty-message" ng-if="!ctrl.editing && !ctrl.profile.bio"><p ng-if="!ctrl.isSelf">Nothing to see here...yet...</p><div ng-if="ctrl.isSelf"><i class="mdi mdi-comment-account-outline"></i><p>Tell other FAVVERS who you are!<br>Write a little about yourself, your likes, your interests.</p><p><button class="btn btn-primary no-shadow" ng-click="ctrl.edit()"><i class="mdi mdi-pencil"></i> Add some text</button></p></div></div><div class="p-t-15" ng-if="!ctrl.editing && ctrl.profile.bio">{{ctrl.profile.bio}}</div><div ng-if="ctrl.editing"><textarea msd-elastic class="info-textarea" ng-model="ctrl.bio" placeholder="Tell the world about you!"></textarea><div class="card-commands"><button class="btn btn-styled btn-social btn-sm no-shadow" ng-click="ctrl.save()" ng-disabled="ctrl.working"><i class="mdi c-green" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-content-save\'"></i> Save</button> <button class="btn btn-styled btn-social btn-sm no-shadow" ng-click="ctrl.cancel()" ng-disabled="ctrl.working"><i class="mdi mdi-block-helper c-red"></i> Cancel</button></div></div></div></div><div class="error-message" ng-if="ctrl.message"><p>{{ctrl.message}}</p></div></div>');
$templateCache.put('template/relationships/action.html','<div class="widget" ng-if="ctrl.step === 1"><div class="profile clearfix" ng-style="{ \'background-image\': \'url(/b/\' + ctrl.target + \')\' }"><img alt="{{ctrl.profile.firstName}} {{ctrl.profile.lastName}}" ng-src="{{\'/i/\' + ctrl.target + \'?size=l\'}}"><div class="name">{{ctrl.profile.firstName}} {{ctrl.profile.lastName}}</div></div><div ng-switch="ctrl.type"><div class="widget-content text-center" ng-switch-when="1"><p>Would you like to add</p><p><strong>{{ctrl.profile.firstName}} {{ctrl.profile.lastName}}</strong></p><p>as a friend?</p><p ng-if="ctrl.message" class="text-center c-red"><strong>{{ctrl.message}}</strong></p></div><div class="widget-actions bgm-amber" ng-switch-when="1"><button class="action text-left" ng-click="ctrl.process(\'confirm\')" ng-disabled="ctrl.working" ng-if="!ctrl.message"><i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-check\'"></i> Confirm</button> <button class="action text-right" ng-click="ctrl.process(\'decline\')" ng-disabled="ctrl.working" ng-if="!ctrl.message">Decline <i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-block-helper\'"></i></button></div><div class="widget-content text-center" ng-switch-when="2"><p>Would you like to send</p><p><strong>{{ctrl.profile.firstName}} {{ctrl.profile.lastName}}</strong></p><p>friend request?</p><p ng-if="ctrl.message" class="text-center c-red"><strong>{{ctrl.message}}</strong></p></div><div class="widget-actions bgm-amber" ng-switch-when="2"><button class="action text-left" ng-click="ctrl.close()" ng-disabled="ctrl.working"><i class="mdi mdi-block-helper"></i> Cancel</button> <button class="action text-right" ng-click="ctrl.send()" ng-disabled="ctrl.working" ng-if="!ctrl.message">Send Request <i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-share\'"></i></button></div><div class="widget-content text-center" ng-switch-when="7"><p>Would you like to remove</p><p><strong>{{ctrl.profile.firstName}} {{ctrl.profile.lastName}}</strong></p><p>as a friend?</p><p ng-if="ctrl.message" class="text-center c-red"><strong>{{ctrl.message}}</strong></p></div><div class="widget-actions bgm-amber" ng-switch-when="7"><button class="action text-left" ng-click="ctrl.close()" ng-disabled="ctrl.working"><i class="mdi mdi-block-helper"></i> Cancel</button> <button class="action text-right" ng-click="ctrl.delete()" ng-disabled="ctrl.working" ng-if="!ctrl.message">Remove <i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-delete\'"></i></button></div></div></div><div class="widget" ng-if="ctrl.step === 2"><div class="widget-header">Hrm...</div><div class="widget-content">It doesn\'t look like that\'s a valid request.</div></div><div class="widget" ng-if="ctrl.step === 3"><div class="widget-header">All set!</div><div class="widget-content">You and <strong>{{ctrl.profile.firstName}} {{ctrl.profile.lastName}}</strong> are now friends.</div></div><div class="widget" ng-if="ctrl.step === 4"><div class="widget-header">All set.</div><div class="widget-content">You declined <strong>{{ctrl.profile.firstName}}\'s</strong> invitation.</div></div>');
$templateCache.put('template/relationships/card.html','<div class="widget profile-card compressed clearfix"><div class="banner" style="background-image: url(\'/b/{{ctrl.profile.id}}\')"><div class="name"><a href="/u/{{ctrl.profile.username}}">{{ctrl.profile.firstName}} {{ctrl.profile.lastName}}</a></div><a href="/u/{{ctrl.profile.username}}" class="image"><img alt="{{ctrl.profile.firstName}} {{ctrl.profile.lastName}}" src="/i/{{ctrl.profile.id}}?size=s"></a></div><div class="content clearfix"><div class="username"><a href="/u/{{ctrl.profile.username}}">&#64;{{ctrl.profile.username}}</a></div><div class="deets"><div class="deet">Posts<br><span class="c-amber">{{ctrl.profile.posts}}</span></div><div class="deet">Followers<br><span class="c-amber">{{ctrl.profile.followers}}</span></div><div class="deet">Following<br><span class="c-amber">{{ctrl.profile.following}}</span></div></div></div><div class="profile-actions"><a class="action" ng-click="ctrl.follow()"><i class="mdi" ng-class="ctrl.profile.isFollowing ? \'mdi-check c-green\' : \'mdi-plus c-blue\'"></i> {{ctrl.profile.isFollowing ? \'Following\' : \'Follow\'}} </a><a class="action" ng-if="ctrl.profile.isFollower"><i class="mdi mdi-check c-green" ng-if="ctrl.profile.isFollower"></i> {{ctrl.profile.isFollower ? \'Follower\' : \'\'}}</a></div></div>');
$templateCache.put('template/relationships/grid.html','<ul class="friends" ng-if="ctrl.initialized"><li ng-repeat="p in ctrl.profiles | limitTo: ctrl.limitTo track by $index "><a href="/u/{{p.username}}" ng-if="p"><img alt="{{p.firstName}} {{p.lastName}}" src="/i/{{p.id}}?size=m" class="img-responsive"></a></li><li class="add bgm-white" ng-if="ctrl.isSelf"><a class="group pointer" ng-click="ctrl.friendSearch()"><i class="mdi mdi-account-multiple-plus"></i> add friends</a></li></ul>');
$templateCache.put('template/relationships/list.html','<div infinite-scroll="ctrl.next()" infinite-scroll-disable="ctrl.empty"><div class="row posts"><div class="col-lg-4 col-md-6 col-sm-6 col-xs-12" ng-repeat="p in ctrl.profiles"><friend-card profile="p" mode="card" init="true"></friend-card></div></div></div>');
$templateCache.put('template/relationships/search.html','<div class="main"><div class="col-sidebar"><div class="widget"><div class="widget-header"><i class="mdi mdi-account-multiple-plus"></i> Friends</div><div class="widget-content"><div class="form-group m-b-5"><input type="text" class="form-control" ng-model="ctrl.query" ng-change="ctrl.search()" ng-model-options="{ debounce: 300 }" placeholder="search for friends" maxlength="100"></div></div></div><div class="widget"><div class="widget-content"><ul class="list-nav"><li ng-click="ctrl.search(false, \'not\')"><a class="pointer" ng-class="{ \'active\' : ctrl.searchType === \'not\' }">Not yet friends</a></li><li ng-click="ctrl.search(false, \'confirmed\')"><a class="pointer" ng-class="{ \'active\' : ctrl.searchType === \'confirmed\' }">Your friends</a></li><li ng-click="ctrl.search(false, \'pending\')"><a class="pointer" ng-class="{ \'active\' : ctrl.searchType === \'pending\' }">Pending Requests</a></li></ul></div></div><div class="widget"><div class="widget-actions bgm-amber single"><button class="action text-left" ng-click="ctrl.invite()" ng-disabled="ctrl.working">Invite a friend <i class="mdi mdi-share"></i></button></div></div></div><div class="col-main clearfix"><div class="widget profile-card" ng-repeat="p in ctrl.profiles" ng-if="!p.deleted"><div class="image"><a href="/u/{{p.username}}"><img alt="{{p.firstName}} {{p.lastName}}" ng-src="/i/{{p.id}}?size=m"></a></div><div class="content" ng-switch="p.isFriend"><a href="/u/{{p.username}}">{{p.firstName}} {{p.lastName}}</a><br><div>&#64;{{p.username}}</div><div><i class="mdi mdi-map-marker"></i> {{p.city}}, {{p.stateProvince}}</div></div><div class="buttons"><button class="btn btn-social btn-styled no-shadow btn-sm m-t-10 w-100" ng-click="ctrl.add(p)" ng-if="!p.isFriend"><i class="mdi mdi-check"></i> Add Friend</button> <button class="btn btn-social btn-styled no-shadow btn-sm m-t-10 w-100" ng-if="p.isFriend && p.isFriend > 0" ng-click="ctrl.remove(p)"><i class="mdi mdi-block-helper"></i>Cancel Request</button> <button class="btn btn-social btn-styled no-shadow btn-sm m-t-10 w-100" ng-if="p.isFriend && p.isFriend === -1" ng-click="ctrl.remove(p)"><i class="mdi mdi-delete"></i>Remove</button></div></div></div><div class="col-sidebar hidden-sm"></div></div>');
$templateCache.put('template/uib/categories.html','<span class="p-c-i"><i class="mdi" ng-class="match.model.icon"></i></span> <span ng-bind="match.label"></span>');
$templateCache.put('template/widgets/widget.html','<div class="widget" ng-class="widgetCtrl.cssClass"><a ng-if="!!widgetCtrl.editLink" ng-click="widgetCtrl.edit()"><i class="mdi mdi-pencil"></i></a><div class="widget-title" ng-if="!!widgetCtrl.title"><span>{{widgetCtrl.title}}</span></div><div class="widget-content" ng-transclude></div></div>');
$templateCache.put('template/posts/comments/comment.html','<div ng-if="!ctrl.comment.deleted"><div class="p-co" ng-class="{ \'p-b-0\' : ctrl.isAuthenticated }"><div class="p-co-t clearfix"><div><a class="c-auto" href="/u/{{ctrl.comment.ownerUsername}}">{{ctrl.comment.owner}}</a></div><div>{{ctrl.calcDate(ctrl.comment.createdDT)}}</div></div><div class="p-co-d">{{ctrl.comment.body}} <button ng-click="ctrl.delete()" ng-if="ctrl.isAuthenticated && (ctrl.isSelf || ctrl.comment.isSelf)"><i class="mdi c-red" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-close\'"></i></button></div></div><post-comments-new post="ctrl.post" parent="ctrl.parent || ctrl.comment" source="ctrl.comment" on-follow="ctrl.follow()"></post-comments-new><post-comments ng-if="!ctrl.isReply" post="ctrl.post" comment="ctrl.comment" parent="ctrl.comment" mode="\'reply\'"></post-comments></div>');
$templateCache.put('template/posts/comments/comments.html','<div class="p-comments"><post-comments-new post="ctrl.post" ng-if="!ctrl.isReply"></post-comments-new><post-comment ng-repeat="comment in ctrl.comments" post="ctrl.post" comment="comment" parent="ctrl.parent"></post-comment></div>');
$templateCache.put('template/posts/comments/new.html','<div ng-class="{ \'reply\' : ctrl.isReply, \'is-active\' : ctrl.active}"><div class="p-co-r" ng-if="ctrl.isReply"><span class="c-auto"><i class="pointer mdi" ng-class="ctrl.source.isFollowing ? \' mdi-star\' : \' mdi-star-outline\'" ng-click="ctrl.follow()"></i> {{ctrl.source.followers}} </span><span class="spacer"></span> <a class="pointer" ng-if="!ctrl.active" ng-click="ctrl.active = true">Reply</a> <a class="pointer" ng-if="ctrl.active" ng-click="ctrl.active = false">Cancel</a></div><div class="p-n-co" ng-if="!ctrl.isReply || ctrl.active"><textarea ng-if="!ctrl.isReply && !ctrl.active" ng-click="ctrl.active = true" rows="1" placeholder="New Comment - Press [Enter] to add / [Shift + Enter] to add a new line"></textarea><textarea ng-if="ctrl.active" focus-on="!!ctrl.active" rows="1" msd-elastic ng-model="ctrl.comment.body" on-enter="ctrl.add()" placeholder="New Comment - Press [Enter] to add / [Shift + Enter] to add a new line"></textarea><button ng-click="ctrl.add()"><i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-comment-outline\'"></i></button></div></div>');
$templateCache.put('template/posts/post/content-favorite.html','<div class="post-content" ng-class="\'m-\' + ctrl.post.topic.color"><div class="title c-auto"><i class="mdi" ng-class="ctrl.post.topic.icon"></i><div><a class="c-auto" ng-href="/category/{{ctrl.post.topic.category}}">{{ctrl.post.topic.category}}</a></div><div><a class="c-auto" ng-href="/topic/{{ctrl.post.topic.path}}">{{ctrl.post.topic.name}}</a></div></div><div class="post-details m-0"><div class="image"><a ng-if="ctrl.post.url" ng-href="{{ctrl.post.url}}" target="_blank"><img alt="placeholder" ngf-src="ctrl.post.image"></a><img ng-if="!ctrl.post.url" alt="placeholder" ngf-src="ctrl.post.image"></div><div class="content p-l-10"><div class="title"><a ng-if="ctrl.post.url" ng-href="{{ctrl.post.url}}" target="_blank">{{ctrl.post.title}}</a> <span ng-if="!ctrl.post.url">{{ctrl.post.title}}</span></div><div class="description break-word" ng-bind-html="ctrl.cleanHtml(ctrl.post.content)"></div></div></div><div class="p-menu-bar"><div class="menu-bar" ng-if="ctrl.isAuthenticated"><ul class="ratings"><li ng-click="ctrl.follow()"><a class="c-auto"><i class="mdi" ng-class="ctrl.post.isFollowing ? \'mdi-star\' : \'mdi-star-outline\'" uib-tooltip="FAVVE!"></i> <span class="count">{{ctrl.post.followers}}</span></a></li><li><a class="c-auto"><i class="mdi mdi-comment-multiple-outline" uib-tooltip="Comments"></i> <span class="count">{{ctrl.post.commentCount}}</span></a></li></ul><ul class="pull-right"><li ng-if="ctrl.post.url" uib-tooltip="Go to website"><a href="{{ctrl.post.url}}" class="c-auto" target="_blank"><i class="mdi mdi-link-variant"></i></a></li><li class="t-icon"><a class="c-auto" ng-click="ctrl.add()"><i class="mdi mdi-folder-plus"></i><div class="small">Add to My FAVVES</div></a></li><li uib-dropdown ng-if="ctrl.isSelf"><i class="mdi mdi-dots-vertical" uib-dropdown-toggle></i><ul uib-dropdown-menu class="dropdown-menu-right"><li ng-if="ctrl.isSelf"><a class="pointer" ng-click="ctrl.edit()"><i class="mdi mdi-pencil"></i> Edit</a></li><li ng-if="ctrl.isSelf"><a class="pointer" ng-click="ctrl.delete(post)"><i class="mdi mdi-delete-forever"></i> Delete</a></li></ul></li></ul></div></div><post-comments post="ctrl.post" mode="ctrl.mode"></post-comments></div>');
$templateCache.put('template/posts/post/content-review.html','<div class="post-content" ng-class="\'m-\' + ctrl.post.topic.color"><div class="title c-auto"><i class="mdi" ng-class="ctrl.post.topic.icon"></i><div><a class="c-auto" ng-href="/category/{{ctrl.post.topic.category}}">{{ctrl.post.topic.category}}</a></div><div><a class="c-auto" ng-href="/topic/{{ctrl.post.topic.path}}">{{ctrl.post.topic.name}}</a></div></div><div class="post-details m-0"><div class="image"><a ng-if="ctrl.post.url" ng-href="{{ctrl.post.url}}" target="_blank"><img alt="placeholder" ngf-src="ctrl.post.image"></a><img ng-if="!ctrl.post.url" alt="placeholder" ngf-src="ctrl.post.image"></div><div class="content p-l-10"><div class="title m-b-5"><a ng-if="ctrl.post.url" ng-href="{{ctrl.post.url}}" target="_blank">{{ctrl.post.title}}</a> <span ng-if="!ctrl.post.url">{{ctrl.post.title}}</span></div><div class="rating"><i class="c-auto mdi" ng-repeat="r in ctrl.ratings track by $index" ng-class="ctrl.post.rating >= r ? \'mdi-star\' : \'mdi-star-outline\'"></i></div><div class="description break-word" ng-bind-html="!ctrl.post.fullContent ? ctrl.cleanHtml(ctrl.post.content) : ctrl.post.fullContent"></div><a ng-click="ctrl.readMore()" class="c-auto pointer" ng-if="ctrl.post.summaryLength < ctrl.post.contentLength && !ctrl.post.fullContent">Read full review ></a></div></div><div class="p-menu-bar"><div class="menu-bar" ng-if="ctrl.isAuthenticated"><ul class="ratings"><li ng-click="ctrl.follow()"><a class="c-auto"><i class="mdi" ng-class="ctrl.post.isFollowing ? \'mdi-star\' : \'mdi-star-outline\'" uib-tooltip="FAVVE!"></i> <span class="count">{{ctrl.post.followers}}</span></a></li><li><a class="c-auto"><i class="mdi mdi-comment-multiple-outline" uib-tooltip="Comments"></i> <span class="count">{{ctrl.post.commentCount}}</span></a></li></ul><ul class="pull-right"><li ng-if="ctrl.post.url" uib-tooltip="Go to website"><a href="{{ctrl.post.url}}" class="c-auto" target="_blank"><i class="mdi mdi-link-variant"></i></a></li><li class="t-icon"><a class="c-auto" ng-click="ctrl.add()"><i class="mdi mdi-folder-plus"></i><div class="small">Add to My FAVVES</div></a></li><li uib-dropdown ng-if="ctrl.isSelf"><i class="mdi mdi-dots-vertical" uib-dropdown-toggle></i><ul uib-dropdown-menu class="dropdown-menu-right"><li ng-if="ctrl.isSelf"><a class="pointer" ng-click="ctrl.edit()"><i class="mdi mdi-pencil"></i> Edit</a></li><li ng-if="ctrl.isSelf"><a class="pointer" ng-click="ctrl.delete(post)"><i class="mdi mdi-delete-forever"></i> Delete</a></li></ul></li></ul></div></div><post-comments post="ctrl.post" mode="ctrl.mode"></post-comments></div>');
$templateCache.put('template/posts/post/content-wishlist.html','<div class="post-content"><div class="post-details m-0"><div class="image"><a ng-if="ctrl.post.url" ng-href="{{ctrl.post.url}}" target="_blank"><img alt="placeholder" ngf-src="ctrl.post.image"></a><img ng-if="!ctrl.post.url" alt="placeholder" ngf-src="ctrl.post.image"></div><div class="content p-l-10"><div class="title"><a ng-if="ctrl.post.url" ng-href="{{ctrl.post.url}}" target="_blank">{{ctrl.post.title}}</a> <span ng-if="!ctrl.post.url">{{ctrl.post.title}}</span></div><div class="description break-word" ng-class="ctrl.isAuthenticated ? \'p-r-10\' :\'\'"><div class="break-word" ng-bind-html="ctrl.cleanHtml(ctrl.post.content)"></div><div class="meta"><div class="row"><div class="col-xs-4" ng-click="ctrl.close()"><strong>Priorty</strong><br>{{ctrl.post.priority}}</div><div class="col-xs-4"><strong>Quantity</strong><br>{{ctrl.post.quantity}}</div><div class="col-xs-4"><strong>Owned</strong><br>{{ctrl.post.owned}}</div></div></div></div></div><div class="functions" ng-if="!ctrl.isAuthenticated"><p class="small text-justify">If you would like to purchase this item, please login first.</p></div></div><div class="p-menu-bar"><div class="menu-bar"><ul class="pull-right"><li ng-if="ctrl.post.url" uib-tooltip="Go to website"><a href="{{ctrl.post.url}}" class="c-auto" target="_blank"><i class="mdi mdi-link-variant"></i></a></li><li class="t-icon" ng-if="ctrl.post.owned < ctrl.post.quantity && ctrl.isAuthenticated"><a class="c-auto" ng-click="ctrl.purchase()"><i class="mdi mdi-shopping"></i><div class="small">Mark as purchased</div></a></li><li uib-dropdown ng-if="ctrl.isSelf"><i class="mdi mdi-dots-vertical" uib-dropdown-toggle></i><ul uib-dropdown-menu class="dropdown-menu-right"><li ng-if="ctrl.isSelf"><a class="pointer" ng-click="ctrl.edit()"><i class="mdi mdi-pencil"></i> Edit</a></li><li ng-if="ctrl.isSelf"><a class="pointer" ng-click="ctrl.delete(post)"><i class="mdi mdi-delete-forever"></i> Delete</a></li></ul></li></ul></div></div><post-comments post="ctrl.post" mode="ctrl.mode"></post-comments></div>');
$templateCache.put('template/posts/post/header-small.html','<div class="post-header mini"><div class="info" ng-switch="ctrl.post.list.type"><a ng-switch-when="0" href="/u/{{ctrl.post.ownerUsername}}/favves?listId={{ctrl.post.list.id}}"><i class="mdi mdi-star text-primary"></i> {{ctrl.post.list.name}} </a><a ng-switch-when="1" href="/u/{{ctrl.post.ownerUsername}}/wishlists?listId={{ctrl.post.list.id}}"><i class="mdi mdi-gift c-white"></i> {{ctrl.post.list.name}} </a><a ng-switch-when="2" href="/u/{{ctrl.post.ownerUsername}}/reviews?listId={{ctrl.post.list.id}}"><i class="mdi mdi-pen c-green"></i> {{ctrl.post.list.name}}</a></div><div class="info text-right"><div>{{ctrl.calcDate(ctrl.post.createdDT)}}</div></div></div>');
$templateCache.put('template/posts/post/header.html','<div class="post-header"><a href="/u/{{ctrl.post.ownerUsername}}"><img alt="{{ctrl.post.owner}}" src="/i/{{ctrl.post.ownerId}}?size=s"></a><div class="info"><a href="/u/{{ctrl.post.ownerUsername}}">{{ctrl.post.owner}}</a><div>{{ctrl.calcDate(ctrl.post.createdDT)}}</div></div><div class="info text-right" ng-switch="ctrl.post.list.type"><a ng-switch-when="0" href="/u/{{ctrl.post.ownerUsername}}/favves?listId={{ctrl.post.list.id}}"><i class="mdi mdi-star text-primary"></i> {{ctrl.post.list.name}} </a><a ng-switch-when="1" href="/u/{{ctrl.post.ownerUsername}}/wishlists?listId={{ctrl.post.list.id}}"><i class="mdi mdi-gift c-white"></i> {{ctrl.post.list.name}} </a><a ng-switch-when="2" href="/u/{{ctrl.post.ownerUsername}}/reviews?listId={{ctrl.post.list.id}}"><i class="mdi mdi-pen c-green"></i> {{ctrl.post.list.name}}</a></div></div>');
$templateCache.put('template/posts/post/post.html','<div class="post" ng-class="\'m-\' + ctrl.post.category.color" ng-if="!ctrl.post.deleted"><div ng-switch="ctrl.mode"><post-header post="ctrl.post" ng-switch-when="list" mode="list"></post-header><post-header post="ctrl.post" ng-switch-when="stream"></post-header></div><div ng-switch="ctrl.post.type"><post-content post="ctrl.post" ng-switch-when="0" type="0" mode="ctrl.mode"></post-content><post-content post="ctrl.post" ng-switch-when="1" type="1" mode="ctrl.mode"></post-content><post-content post="ctrl.post" ng-switch-when="2" type="2" mode="ctrl.mode"></post-content></div></div>');
$templateCache.put('template/posts/editor/delete.html','<div class="widget"><div class="widget-header bgm-red">Are you sure?<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><p class="text-center giant"><i class="mdi mdi-alert c-red"></i></p><p class="text-center">Deleting this item is permanent and cannot be recovered.</p><p class="card-commands m-t-20 text-danger" ng-if="ctrl.message">{{ctrl.message}}</p></div><div class="widget-actions bgm-red"><button class="action text-left" ng-click="ctrl.close()" ng-disabled="ctrl.working"><i class="mdi mdi-block-helper"></i> Cancel</button> <button class="action text-right" ng-click="ctrl.delete()" ng-disabled="ctrl.working">Delete <i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-check\'"></i></button></div></div>');
$templateCache.put('template/posts/editor/editor.html','<div class="widget" ng-switch="$ctrl.post.type"><post-editor-content post="$ctrl.post" ng-switch-when="0" type="0" list="$ctrl.list" init="true" topic="$ctrl.topic"></post-editor-content><post-editor-content post="$ctrl.post" ng-switch-when="1" type="1" list="$ctrl.list" init="true"></post-editor-content><post-editor-content post="$ctrl.post" ng-switch-when="2" type="2" list="$ctrl.list" init="true" topic="$ctrl.topic"></post-editor-content></div>');
$templateCache.put('template/posts/editor/favve.html','<!--Step 1 - Initial Screen--><div class="widget" ng-if="ctrl.editor.step === 1"><div class="widget-header bgm-amber">Let\'s find your FAVVE!<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><input class="form-control" placeholder="Type the name of your FAVVE" ng-model="ctrl.editor.topicSearch" ng-model-options="{ debounce: 300 }" ng-change="ctrl.getTopics()"><div class="p-s-m" ng-if="!ctrl.editor.state && !ctrl.topics.length"><p>Type the name of your FAVVE to search for it. If we don\'t have it, it\'s cool.</p><p>You can be the first to add it!</p></div><div class="p-s-m m-t-15" ng-if="ctrl.editor.state === \'empty\'"><p>Looks like we don\'t have that FAVVE in our database...yet...</p><p>Go ahead and add it!</p></div><div class="p-s-m" ng-if="ctrl.editor.state === \'searching\'"><p>Searching...</p><p><i class="mdi mdi-autorenew mdi-spin"></i></p></div><div class="p-t-list" ng-if="ctrl.topics.length"><div class="t-l-i m-b-15" ng-repeat="topic in ctrl.topics" ng-class="\'m-\' + topic.color" ng-click="ctrl.goToStep(6, topic)"><div class="img" ng-if="topic.hasImage"><img alt="topic.name" ng-src="/api/topics/{{topic.id}}/image?size=s"></div><div class="n-img bgm-auto" ng-if="!topic.hasImage"><i class="mdi" ng-class="topic.icon"></i></div><div class="icon"><i class="mdi mdi-chevron-right"></i></div><div class="title c-auto">{{topic.name}}</div><div class="category c-auto">{{topic.category}}</div></div><p class="text-center">Not seeing what you want? Go ahead and add it!</p></div></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.close()" ng-disabled="ctrl.working"><i class="mdi mdi-block-helper"></i> Cancel</button> <button class="action text-right" ng-click="ctrl.goToStep(2)" ng-disabled="ctrl.working">Add a new FAVVE <i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-chevron-right\'"></i></button></div></div><!--Step 2 - Select a category--><div class="widget" ng-if="ctrl.editor.step === 2"><div class="widget-header bgm-amber">Select a category<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><ul class="p-c-list row"><li class="col-xs-4" ng-repeat="category in ctrl.categories" ng-click="ctrl.goToStep(10, category)"><div class="p-category"><div ng-class="\'bgm-\' + category.color"><i class="mdi" ng-class="category.icon"></i></div>{{category.name}}</div></li></ul></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.previousStep()" ng-disabled="ctrl.working"><i class="mdi mdi-chevron-left"></i> Back</button></div></div><!--Step 10 - select a method--><div class="widget" ng-if="ctrl.editor.step === 10"><div class="widget-header bgm-amber">How would you like to add it?<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content step"><div class="choices"><div class="choice" ng-click="ctrl.goToStep(3)"><i class="mdi mdi-emoticon c-blue"></i><div class="text">Add<br>manually</div></div><div class="choice" ng-click="ctrl.goToStep(5)"><i class="mdi mdi-web c-green"></i><div class="text">Add<br>via a website</div></div><div class="choice" ng-click="ctrl.goToStep(4)"><i class="mdi mdi-map-marker c-purple"></i><div class="text">Add<br>via street address</div></div></div></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.previousStep()" ng-disabled="ctrl.working"><i class="mdi mdi-chevron-left"></i> Back</button></div></div><!--Step 4 - add via address--><div class="widget" ng-if="ctrl.editor.step === 4"><div class="widget-header bgm-amber">Add via address<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="form-group"><div class="fg-line"><input vs-google-autocomplete ng-model="ctrl.address" vs-place="ctrl.place" vs-place-id="ctrl.post.address.placeId" vs-street-number="ctrl.post.address.streetNumber" vs-street="ctrl.post.address.street" vs-city="ctrl.post.address.city" vs-state="ctrl.post.address.stateProvince" vs-country-short="ctrl.post.address.countryCode" vs-country="ctrl.post.address.countryRegion" vs-post-code="ctrl.post.address.PostalCode" vs-district="ctrl.post.address.district" vs-latitude="ctrl.post.address.latitude" vs-longitude="ctrl.post.address.longitude" type="text" class="form-control" placeholder="Search for an address"></div></div><div class="form-group has-label"><label class="control-label">Name:</label><div class="fg-line"><input class="form-control" placeholder="Type the name of your FAVVE" ng-model="ctrl.place.name"></div></div></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.previousStep()"><i class="mdi mdi-chevron-left"></i> Back</button> <button class="action text-right" ng-click="ctrl.goToStep(8)" ng-if="ctrl.place.name">Next <i class="mdi mdi-chevron-right"></i></button></div></div><!--Step 5 - add via website--><div class="widget" ng-if="ctrl.editor.step === 5"><div class="widget-header bgm-amber">Add via address<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="input-group row m-b-15 clearfix"><input ng-model="ctrl.website" ng-paste="ctrl.getWebsite($event)" on-enter="ctrl.getWebsite()" type="text" class="form-control fc-boxed" placeholder="Search for an address"><div class="input-group-btn"><button class="btn btn-primary btn-sm no-shadow" type="button"><i class="mdi mdi-magnify"></i> Search</button></div></div><div class="post-details" ng-if="ctrl.editor.preview.hasMatch && !ctrl.editor.searching"><div class="image"><img alt="" ng-src="{{ctrl.editor.preview.image}}"></div><div class="content p-l-10"><div class="title">{{ctrl.editor.preview.title}}</div><div class="description">{{ctrl.editor.preview.description}}</div></div></div><div class="text-center" ng-if="ctrl.editor.searching"><img alt="loading" src="/assets/img/cube.gif"></div></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.previousStep()"><i class="mdi mdi-chevron-left"></i> Back</button> <button class="action text-right" ng-click="ctrl.goToStep(7)" ng-if="ctrl.editor.preview.hasMatch">Next <i class="mdi mdi-chevron-right"></i></button></div></div><!--Step 3 - add the favve--><div class="widget" ng-if="ctrl.editor.step === 3" ng-class="\'m-\' + ctrl.post.category.color"><div class="widget-header bgm-auto">Fill in the details<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="post-details m-t-0"><div class="image"><div class="p-i-image" ngf-select ngf-drop ng-model="ctrl.post.image" ngf-max-size="2MB" ngf-accept="\'image/*\'" ngf-resize="resizeObj" ngf-drop-available="dropAvailable"><div class="drop-box" ng-show="!ctrl.post.image"><i class="mdi mdi-camera"></i> Select <span ng-show="dropAvailable">or Drop</span> Image</div><img alt="placeholder" ngf-src="ctrl.post.image"></div><hr><div class="c-auto"><i class="mdi" ng-class="ctrl.post.category.icon"></i><div>{{ctrl.post.topic.name}}</div><small>{{ctrl.post.category.name}}</small></div></div><div class="content p-l-10"><div class="form-group-sm m-b-15"><label class="control-label">Name <small class="text-danger">(required)</small></label><input class="form-control fc-boxed" type="text" ng-model="ctrl.post.title" maxlength="255"> <small>{{255 - ctrl.post.title.length}}/255 characters left</small></div><div class="form-group-sm m-b-15"><label class="control-label">Description<small class="text-danger">(required)</small></label><textarea rows="5" class="form-control fc-boxed p-5" ng-model="ctrl.post.content" maxlength="500"></textarea><small>{{500 - ctrl.post.content.length}}/500 characters left.</small></div><div class="form-group-sm m-b-15"><label class="control-label">Save To <small class="text-danger">(required)</small></label><select selector model="ctrl.post.list" options="ctrl.lists" label-attr="name" placeholder="Add or select a list" create="ctrl.addList(input)"></select><small>To add a new list, type a new list name and click \'add\'</small></div><div class="form-group has-label" ng-if="ctrl.editor.showWebsite && !ctrl.editor.hasWebsite"><label class="control-label">Url (optional)</label><div class="fg-line"><input type="text" class="form-control" placeholder="Where can people find this online?" ng-model="ctrl.post.url"></div></div><div class="form-group" ng-if="ctrl.editor.hasWebsite"><label class="control-label">Website</label><input class="form-control fc-boxed" disabled="disabled" value="{{::ctrl.post.url}}"></div><div class="form-group has-label" ng-if="ctrl.editor.showAddress && !ctrl.editor.hasAddress"><label class="control-label">Address (optional)</label><div class="fg-line" ng-if="!ctrl.editor.hasAddress"><input vs-google-autocomplete ng-model="ctrl.address" vs-place="ctrl.place" vs-place-id="ctrl.post.address.placeId" vs-street-number="ctrl.post.address.streetNumber" vs-street="ctrl.post.address.street" vs-city="ctrl.post.address.city" vs-state="ctrl.post.address.stateProvince" vs-country-short="ctrl.post.address.countryCode" vs-country="ctrl.post.address.countryRegion" vs-post-code="ctrl.post.address.PostalCode" vs-district="ctrl.post.address.district" vs-latitude="ctrl.post.address.latitude" vs-longitude="ctrl.post.address.longitude" type="text" name="place" id="place" class="form-control" placeholder="Search for an address"></div></div><div class="form-group" ng-if="ctrl.editor.hasAddress"><label class="control-label">Address</label><p>{{ctrl.post.address.streetNumber}} {{ctrl.post.address.street}}<br>{{ctrl.post.address.city}}, {{ctrl.post.address.stateProvince}} {{ctrl.post.address.PostalCode}}<br>{{ctrl.post.address.countryRegion}}</p></div><div class="form-group has-label" ng-if="ctrl.editor.showTags"><label class="control-label">Tag it! (optional)</label><tags-input ng-model="ctrl.post.tags" max-length="30" max-tags="8" replace-spaces-with-dashes="false" placeholder="tags help others find similar items"></tags-input></div></div></div><div class="p-10 c-red" ng-if="ctrl.message">{{ctrl.message}}</div></div><div class="modal-actions triple bgm-gray"><button class="action text-center" ng-if="!ctrl.editor.hasWebsite" ng-class="{ \'bgm-bluegray\' : ctrl.editor.showWebsite }" ng-click="ctrl.showOptional(\'website\')"><i class="mdi mdi-web"></i> Website</button> <button class="action text-center" ng-if="!ctrl.editor.hasAddress" ng-class="{ \'bgm-bluegray\' : ctrl.editor.showAddress }" ng-click="ctrl.showOptional(\'address\')"><i class="mdi mdi-map-marker"></i> Address</button> <button class="action text-center" ng-class="{ \'bgm-bluegray\' : ctrl.editor.showTags }" ng-click="ctrl.showOptional(\'tags\')"><i class="mdi mdi-tag"></i> Tag it!</button></div><div class="widget-actions bgm-auto" ng-if="ctrl.state !== \'saving\'"><button class="action text-left" ng-click="ctrl.previousStep()" ng-if="!ctrl.editing"><i class="mdi mdi-chevron-left"></i> Back</button> <button class="action text-right pull-right" ng-click="ctrl.save()" ng-if="ctrl.post.title && ctrl.post.content">Save <i class="mdi mdi-content-save"></i></button></div><div class="widget-actions bgm-auto single" ng-if="ctrl.state === \'saving\'"><button class="action text-center c-white"><i class="mdi mdi-spin mdi-autorenew"></i></button></div></div>');
$templateCache.put('template/posts/editor/review.html','<div><!--Step 1 - Initial Screen--><div class="widget" ng-if="ctrl.editor.step === 1"><div class="widget-header bgm-amber">Search for a topic to write about<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><input class="form-control" placeholder="Search for a topic" ng-model="ctrl.editor.topicSearch" ng-model-options="{ debounce: 300 }" ng-change="ctrl.getTopics()"><div class="p-s-m" ng-if="!ctrl.editor.state && !ctrl.topics.length"><p>Type the name of a topic to search for it. If we don\'t have it, it\'s cool.</p><p>You can be the first to add it!</p></div><div class="p-s-m m-t-15" ng-if="ctrl.editor.state === \'empty\'"><p>Looks like we don\'t have that topic in our database...yet...</p><p>Go ahead and add it!</p></div><div class="p-s-m" ng-if="ctrl.editor.state === \'searching\'"><p>Searching...</p><p><i class="mdi mdi-autorenew mdi-spin"></i></p></div><div class="p-t-list" ng-if="ctrl.topics.length"><div class="t-l-i m-b-15" ng-repeat="topic in ctrl.topics" ng-class="\'m-\' + topic.color" ng-click="ctrl.goToStep(6, topic)"><div class="img" ng-if="topic.hasImage"><img alt="topic.name" ng-src="/api/topics/{{topic.id}}/image?size=s"></div><div class="n-img bgm-auto" ng-if="!topic.hasImage"><i class="mdi" ng-class="topic.icon"></i></div><div class="icon"><i class="mdi mdi-chevron-right"></i></div><div class="title c-auto">{{topic.name}}</div><div class="category c-auto">{{topic.category}}</div></div><p class="text-center">Not seeing what you want? Go ahead and add it!</p></div></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.close()" ng-disabled="ctrl.working"><i class="mdi mdi-block-helper"></i> Cancel</button> <button class="action text-right" ng-click="ctrl.goToStep(2)" ng-disabled="ctrl.working">Add a new topic <i class="mdi" ng-class="ctrl.working ? \'mdi-spin mdi-autorenew\' : \'mdi-chevron-right\'"></i></button></div></div><!--Step 2 - Select a category--><div class="widget" ng-if="ctrl.editor.step === 2"><div class="widget-header bgm-amber">Select a category<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><ul class="p-c-list row"><li class="col-xs-4" ng-repeat="category in ctrl.categories" ng-click="ctrl.goToStep(10, category)"><div class="p-category"><div ng-class="\'bgm-\' + category.color"><i class="mdi" ng-class="category.icon"></i></div>{{category.name}}</div></li></ul></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.previousStep()" ng-disabled="ctrl.working"><i class="mdi mdi-chevron-left"></i> Back</button></div></div><!--Step 10 - select a method--><div class="widget" ng-if="ctrl.editor.step === 10"><div class="widget-header bgm-amber">How would you like to add it?<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content step text-center"><div class="choices"><div class="choice" ng-click="ctrl.goToStep(3)"><i class="mdi mdi-emoticon c-blue"></i><div class="text">Add<br>manually</div></div><div class="choice" ng-click="ctrl.goToStep(5)"><i class="mdi mdi-web c-green"></i><div class="text">Add<br>via a website</div></div><div class="choice" ng-click="ctrl.goToStep(4)"><i class="mdi mdi-map-marker c-purple"></i><div class="text">Add<br>via street address</div></div></div></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.previousStep()" ng-disabled="ctrl.working"><i class="mdi mdi-chevron-left"></i> Back</button></div></div><!--Step 4 - add via address--><div class="widget" ng-if="ctrl.editor.step === 4"><div class="widget-header bgm-amber">Add via address<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="form-group"><div class="fg-line"><input vs-google-autocomplete ng-model="ctrl.address" vs-place="ctrl.place" vs-place-id="ctrl.post.address.placeId" vs-street-number="ctrl.post.address.streetNumber" vs-street="ctrl.post.address.street" vs-city="ctrl.post.address.city" vs-state="ctrl.post.address.stateProvince" vs-country-short="ctrl.post.address.countryCode" vs-country="ctrl.post.address.countryRegion" vs-post-code="ctrl.post.address.PostalCode" vs-district="ctrl.post.address.district" vs-latitude="ctrl.post.address.latitude" vs-longitude="ctrl.post.address.longitude" type="text" class="form-control" placeholder="Search for an address"></div></div><div class="form-group has-label"><label class="control-label">Name:</label><div class="fg-line"><input class="form-control" placeholder="Type the name of your FAVVE" ng-model="ctrl.place.name"></div></div></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.previousStep()"><i class="mdi mdi-chevron-left"></i> Back</button> <button class="action text-right" ng-click="ctrl.goToStep(8)" ng-if="ctrl.place.name">Next <i class="mdi mdi-chevron-right"></i></button></div></div><!--Step 5 - add via website--><div class="widget" ng-if="ctrl.editor.step === 5"><div class="widget-header bgm-amber">Add via address<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="input-group row m-b-15 clearfix"><input ng-model="ctrl.website" ng-paste="ctrl.getWebsite($event)" on-enter="ctrl.getWebsite()" type="text" class="form-control fc-boxed" placeholder="Search for an address"><div class="input-group-btn"><button class="btn btn-primary btn-sm no-shadow" type="button" ng-click="ctrl.getWebsite()"><i class="mdi mdi-magnify"></i> Search</button></div></div><p ng-if="ctrl.message" class="text-center text-danger">{{ctrl.message}}</p><div class="post-details" ng-if="ctrl.editor.preview.hasMatch && !ctrl.editor.searching"><div class="image"><img alt="" ng-src="{{ctrl.editor.preview.image}}"></div><div class="content p-l-10"><div class="title">{{ctrl.editor.preview.title}}</div><div class="description">{{ctrl.editor.preview.description}}</div></div></div><div class="text-center" ng-if="ctrl.editor.searching"><img alt="loading" src="/assets/img/cube.gif"></div></div><div class="widget-actions bgm-amber"><button class="action text-left" ng-click="ctrl.previousStep()"><i class="mdi mdi-chevron-left"></i> Back</button> <button class="action text-right" ng-click="ctrl.goToStep(7)" ng-if="ctrl.editor.preview.hasMatch">Next <i class="mdi mdi-chevron-right"></i></button></div></div><!--Step 3 - add the details--><div class="widget" ng-if="ctrl.editor.step === 3" ng-class="\'m-\' + ctrl.post.category.color"><div class="widget-header bgm-auto">Let\'s add in some details first<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="post-details m-t-0"><div class="image"><div class="c-auto"><i class="mdi" ng-class="ctrl.post.category.icon"></i> <small>{{ctrl.post.category.name}}</small><div>{{ctrl.post.topic.name}}</div></div><hr><div class="p-i-image" ngf-select ngf-drop ng-model="ctrl.post.image" ngf-max-size="2MB" ngf-accept="\'image/*\'" ngf-resize="resizeObj" ngf-drop-available="dropAvailable"><div class="drop-box" ng-show="!ctrl.post.image"><i class="mdi mdi-camera"></i> Select <span ng-show="dropAvailable">or Drop</span> Image</div><img alt="placeholder" ngf-src="ctrl.post.image"></div></div><div class="content p-l-10"><div class="form-group-sm m-b-15" ng-if="ctrl.hideTitle"><label class="control-label">Name <small class="text-danger">(required)</small></label><input class="form-control fc-boxed" type="text" ng-model="ctrl.post.title" maxlength="255"> <small>{{255 - ctrl.post.title.length}}/255 characters left</small></div><div class="form-group-sm m-b-15"><label class="control-label">Title <small class="text-danger">(required)</small></label><input class="form-control fc-boxed" type="text" ng-model="ctrl.post.title" maxlength="255"> <small>{{255 - ctrl.post.title.length}}/255 characters left</small></div><div class="form-group-sm m-b-15"><label class="control-label">Save To <small class="text-danger">(required)</small></label><select selector model="ctrl.post.list" options="ctrl.lists" label-attr="name" placeholder="Add or select a list" create="ctrl.addList(input)"></select><small>To add a new list, type a new list name and click \'add\'</small></div><div class="form-group-sm m-b-15"><label class="control-label">Rating</label><div class="rating pull-right text-right"><span uib-rating data-readonly="true" class="text-primary" ng-model="ctrl.post.rating" max="5" disabled="true" state-on="\'mdi mdi-star\'" state-off="\'mdi mdi-star-outline\'"></span></div></div><div class="form-group m-b-15"><label class="control-label">Review <small>(required) </small><small>{{ctrl.maxLength - ctrl.post.content.length}}/{{ctrl.maxLength}} characters left.</small></label><summernote ng-model="ctrl.post.content" config="ctrl.options"></summernote></div><div class="form-group has-label" ng-if="ctrl.editor.showWebsite && !ctrl.editor.hasWebsite"><label class="control-label">Url (optional)</label><div class="fg-line"><input type="text" class="form-control" placeholder="Where can people find this online?" ng-model="ctrl.post.url"></div></div><div class="form-group" ng-if="ctrl.editor.hasWebsite"><label class="control-label">Website</label><input class="form-control fc-boxed" disabled="disabled" value="{{::ctrl.post.url}}"></div><div class="form-group has-label" ng-if="ctrl.editor.showAddress && !ctrl.editor.hasAddress"><label class="control-label">Address (optional)</label><div class="fg-line" ng-if="!ctrl.editor.hasAddress"><input vs-google-autocomplete ng-model="ctrl.address" vs-place="ctrl.place" vs-place-id="ctrl.post.address.placeId" vs-street-number="ctrl.post.address.streetNumber" vs-street="ctrl.post.address.street" vs-city="ctrl.post.address.city" vs-state="ctrl.post.address.stateProvince" vs-country-short="ctrl.post.address.countryCode" vs-country="ctrl.post.address.countryRegion" vs-post-code="ctrl.post.address.PostalCode" vs-district="ctrl.post.address.district" vs-latitude="ctrl.post.address.latitude" vs-longitude="ctrl.post.address.longitude" type="text" name="place" id="place" class="form-control" placeholder="Search for an address"></div></div><div class="form-group" ng-if="ctrl.editor.hasAddress"><label class="control-label">Address</label><p>{{ctrl.post.address.streetNumber}} {{ctrl.post.address.street}}<br>{{ctrl.post.address.city}}, {{ctrl.post.address.stateProvince}} {{ctrl.post.address.PostalCode}}<br>{{ctrl.post.address.countryRegion}}</p></div><div class="form-group has-label" ng-if="ctrl.editor.showTags"><label class="control-label">Tag it! (optional)</label><tags-input ng-model="ctrl.post.tags" max-length="30" max-tags="8" replace-spaces-with-dashes="false" placeholder="tags help others find similar items"></tags-input></div></div></div><div class="p-10 c-red" ng-if="ctrl.message">{{ctrl.message}}</div></div><div class="modal-actions triple bgm-gray"><button class="action text-center" ng-if="!ctrl.editor.hasWebsite" ng-class="{ \'bgm-bluegray\' : ctrl.editor.showWebsite }" ng-click="ctrl.showOptional(\'website\')"><i class="mdi mdi-web"></i> Website</button> <button class="action text-center" ng-if="!ctrl.editor.hasAddress" ng-class="{ \'bgm-bluegray\' : ctrl.editor.showAddress }" ng-click="ctrl.showOptional(\'address\')"><i class="mdi mdi-map-marker"></i> Address</button> <button class="action text-center" ng-class="{ \'bgm-bluegray\' : ctrl.editor.showTags }" ng-click="ctrl.showOptional(\'tags\')"><i class="mdi mdi-tag"></i> Tag it!</button></div><div class="widget-actions bgm-auto" ng-if="ctrl.state !== \'saving\'"><button class="action text-left" ng-click="ctrl.previousStep()" ng-if="!ctrl.editing"><i class="mdi mdi-chevron-left"></i> Back</button> <button class="action text-right pull-right" ng-click="ctrl.save()" ng-if="ctrl.post.title && ctrl.post.content">Save <i class="mdi mdi-content-save"></i></button></div><div class="widget-actions bgm-auto single" ng-if="ctrl.state === \'saving\'"><button class="action text-center c-white"><i class="mdi mdi-spin mdi-autorenew"></i></button></div></div></div>');
$templateCache.put('template/posts/editor/wishlist.html','<!-- Step 1: Initial screen--><div class="widget" ng-if="ctrl.editor.step === 1"><div class="widget-header bgm-amber"><span ng-bind="ctrl.editing ? \'Edit\' : \'Add a new\'"></span> wish list item<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content p-b-25"><h4>Select a category</h4><ul class="p-c-list row"><li class="col-xs-4" ng-repeat="category in ctrl.categories" ng-click="ctrl.goToStep(10, category, null, 2)"><div class="p-category"><div ng-class="\'bgm-\' + category.color"><i class="mdi" ng-class="category.icon"></i></div>{{category.name}}</div></li></ul></div></div><!-- Step 2: Select a category--><div class="widget" ng-if="ctrl.editor.step === 2" ng-class="\'m-\' + ctrl.post.category.color"><div class="widget-header bgm-auto"><span ng-bind="ctrl.editing ? \'Edit\' : \'Add a new\'"></span> wish list item<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content p-b-0"><div class="step text-center"><div class="choices"><div class="choice" ng-click="ctrl.goToStep(3)"><i class="mdi mdi-emoticon c-blue"></i><div class="text">Add<br>manually</div></div><div class="choice" ng-click="ctrl.goToStep(5)"><i class="mdi mdi-web c-green"></i><div class="text">Add<br>via a website</div></div></div></div></div></div><!-- Step 5: Search via website --><div class="widget" ng-if="ctrl.editor.step === 5" ng-class="\'m-\' + ctrl.post.category.color"><div class="widget-header bgm-auto">Search via website<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="input-group row m-b-15 clearfix"><input ng-model="ctrl.website" ng-paste="ctrl.getWebsite($event)" on-enter="ctrl.getWebsite()" type="text" class="form-control fc-boxed" placeholder="Search for an address"><div class="input-group-btn"><button class="btn btn-primary btn-sm no-shadow" type="button"><i class="mdi mdi-magnify"></i> Search</button></div></div><div class="post-details" ng-if="ctrl.editor.preview.hasMatch && !ctrl.editor.searching"><div class="image"><img alt="" ng-src="{{ctrl.editor.preview.image}}"></div><div class="content p-l-10"><div class="title">{{ctrl.editor.preview.title}}</div><div class="description">{{ctrl.editor.preview.description}}</div></div></div><div class="text-center" ng-if="ctrl.editor.searching"><img alt="loading" src="/assets/img/cube.gif"></div></div><div class="widget-actions bgm-auto"><button class="action text-left" ng-click="ctrl.previousStep()"><i class="mdi mdi-chevron-left"></i> Back</button> <button class="action text-right" ng-click="ctrl.goToStep(7)" ng-if="ctrl.editor.preview.hasMatch">Next <i class="mdi mdi-chevron-right"></i></button></div></div><!-- Step 3: Add Manually --><div class="widget" ng-if="ctrl.editor.step === 3" ng-class="\'m-\' + ctrl.post.category.color"><div class="widget-header bgm-auto"><span ng-bind="ctrl.editing ? \'Edit\' : \'Add a new\'"></span> wish list item<ul class="actions actions-alt"><li><a ng-click="ctrl.close()"><i class="mdi mdi-close"></i></a></li></ul></div><div class="widget-content"><div class="post-details m-t-0"><div class="image"><div class="p-i-image" ngf-select ngf-drop ng-model="ctrl.post.image" ngf-max-size="2MB" ngf-accept="\'image/*\'" ngf-resize="resizeObj" ngf-drop-available="dropAvailable"><div class="drop-box" ng-show="!ctrl.post.image"><i class="mdi mdi-camera"></i> Select <span ng-show="dropAvailable">or Drop</span> Image</div><img alt="placeholder" ngf-src="ctrl.post.image"></div><hr><div class="c-auto"><i class="mdi" ng-class="ctrl.post.category.icon"></i> <small>{{ctrl.post.category.name}}</small></div></div><div class="content p-l-10"><div class="form-group-sm m-b-15"><label class="control-label">Name of the item <small class="text-danger">(required)</small></label><input class="form-control fc-boxed" type="text" ng-model="ctrl.post.title" maxlength="255"> <small>{{255 - ctrl.post.title.length}}/255 characters left</small></div><div class="form-group-sm m-b-15"><label class="control-label">Save To <small class="text-danger">(required)</small></label><select selector model="ctrl.post.list" options="ctrl.lists" label-attr="name" placeholder="Add or select a list" create="ctrl.addList(input)"></select><small>To add a new list, type a new list name and click \'add\'</small></div><div class="form-group-sm m-b-15"><label class="control-label">Description <small class="text-danger">(required)</small></label><textarea rows="5" class="form-control fc-boxed p-5" ng-model="ctrl.post.content" maxlength="500"></textarea><small>{{500 - ctrl.post.content.length}}/500 characters left.</small></div><div class="form-group has-label" ng-if="!ctrl.editor.hasWebsite"><label class="control-label">Url (optional)</label><div class="fg-line"><input type="text" class="form-control" placeholder="Where can people find this online?" ng-model="ctrl.post.url"></div></div><div class="form-group" ng-if="ctrl.editor.hasWebsite"><label class="control-label">Website</label><input class="form-control fc-boxed" disabled="disabled" value="{{::ctrl.post.url}}"></div><hr><div class="row"><div class="col-xs-4"><div class="form-group-sm m-b-15"><label class="control-label">Priority</label><div class="select"><select class="form-control fc-box" ng-model="ctrl.post.priority" ng-options="p as p for p in ctrl.priorities"></select></div></div></div><div class="col-xs-4"><div class="form-group-sm m-b-15"><label class="control-label">Quantity</label><input class="form-control fc-boxed" type="number" ng-model="ctrl.post.quantity" min="1" max="99"></div></div><div class="col-xs-4"><div class="form-group-sm m-b-15"><label class="control-label">Owned</label><input class="form-control fc-boxed" type="number" ng-model="ctrl.post.owned" min="0" max="99"></div></div></div></div></div><div class="p-10 c-red" ng-if="ctrl.message">{{ctrl.message}}</div></div><div class="widget-actions bgm-auto"><button class="action text-left" ng-click="ctrl.previousStep()" ng-if="!ctrl.editing"><i class="mdi mdi-chevron-left"></i> Back</button> <button class="action text-right pull-right" ng-click="ctrl.save()" ng-if="ctrl.post.title">Save <i class="mdi mdi-content-save"></i></button></div></div>');}]);
app.controller('AppCtrl', [
    '$uibModal',
    '$rootScope',
    '$sce',
    'core',
    'modal',
    function ($uibModal, $rootScope, $sce, core, modal) {

        var self = this;

        self.modal = null;

        self.searching = false;

        self.search = function() {
            self.searching = !self.searching;
        };

        $rootScope.$on('search:close', function () {
            self.searching = false;
        });

        self.openModal = function(template, ctrl, windowClass, data) {
            $rootScope.modal = $uibModal.open({
                templateUrl: template,
                controller: ctrl,
                windowClass: windowClass,
                resolve: {
                    data: function() {
                        return data;
                    }
                }
            });
        };

        self.add = function (type, data) {

            type = type ? type + '' : '';

            var bindings = {};

            switch(type) {
                case 'friend':
                    bindings.target = function () { return data };
                    bindings.init = function () { return true };
                    bindings.mode = function () { return 'single' };
                    modal.Open('friendAction', bindings, 'w-300');
                    break;

                case 'friends':
                    bindings.mode = function () { return 'search'; };
                    bindings.init = function () { return true; };
                    modal.Open('friendSearch', bindings, 'w-500');
                    break;
                default:
                    bindings.post = function() { return { type: Number(type) }; };
                    modal.Open('postEditor', bindings, 'w-500');
                    break;
            }
        };

        self.closeModal = function() {
            $rootScope.modal.close();
        };

        self.colorScale = function(value, arr) {
            return core.ColorScale(value, arr);
        };

        self.cleanHtml = function (html) {
            return $sce.trustAsHtml(html);
        };

        self.calcDate = function (date) {
            return core.CalcDate(date);
        };

        self.go = function(url, hard) {
            if (hard)
                window.location.replace(url);
            else
                window.location = url;
        };
    }
]);

app.controller('AuthenticationCtrl', [
    'core',
    '$rootScope',
    function (core, $rootScope) {

        var self = this;

        self.working = false;
        self.message = '';
        self.mode = 'login';
        self.currentUrl = document.getElementById('returnUrl').value;

        self.user = {
            email: '',
            password: '',
            confirmPassword: '',
            code: '',
            rememberMe: true
        };

        self.show = function(mode) {
            self.mode = mode;
        };

        self.login = function() {

            self.message = '';
            self.working = true;

            if (!self.user.email || !self.user.password) {
                self.message = 'A valid email address and password are required';
                self.working = false;
                return;
            }

            core.Post('account/login', self.user)
                .then(function () {
                    var returnUrl = document.getElementById('returnUrl');

                    if (returnUrl) {
                        window.location.replace(returnUrl.value);
                    } else {
                        window.location.reload();
                    }
                },
                function(response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        self.forgotPassword = function () {

            self.message = '';
            self.working = true;

            if (!self.user.email) {
                self.message = 'Please enter your email address';
                self.working = false;
                return;
            }

            core.Post('/api/account/forgotPassword', self.user)
                .then(function () {
                    self.show('recoverPasswordConfirm');
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        self.recoverPassword = function() {
            self.message = '';
            self.working = true;

            core.Post('/api/account/recoverPassword', self.user)
                .then(function () {
                    window.location.replace('/');
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        self.sendLink = function () {

            self.message = '';
            self.working = true;

            core.Get('api/account/sendLink')
                .then(function () {
                        self.mode = 'linkSent';
                    },
                    function (response) {
                        self.message = response.data.message;
                        self.working = false;
                    });
        };

        self.initialize = function(mode) {
            self.mode = mode;
        };

        self.close = function() {
            $rootScope.modal.close();
        };
    }
]);
app.controller('ContactCtrl', [
    'core',
    function (core) {

        var self = this;

        self.working = false;
        self.messageSent = false;

        self.message = '';
        self.contact = {
            name: '',
            email: '',
            body: ''
        }

        self.sendMessage = function() {
            self.working = true;

            core.Post('/contact', self.contact)
                .then(function() {
                        self.messageSent = true;
                        self.working = false;
                    },
                    function(response) {
                        self.message = response.data.message;
                        self.working = false;
                    });
        }
    }
]);
app.controller('HeaderCtrl', [
    'core',
    function() {

        var self = this;

        self.search = '';

        

    }
]);
(function () {
    'use strict';

    angular
        .module('selene')
        .controller('UserInterestController', interestController);

    interestController.$inject = ['core', 'alerts', '$q', '$scope']; 

    function interestController(core, alerts, $q, $scope) {

        var self = this;
        var rootUrl = '/api/categories';
        var regex = /^[0-9a-zA-zçáàãâéèêẽíìĩîóòôõúùũüûÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ ]*$/;

        self.id = 0;
        self.working = false;
        self.categories = [];
        self.category = 0;

        self.getCategories = function(force) {
            if (!force && self.working) return;

            core.Get(rootUrl)
                .then(function(response) {
                    self.categories = response.data;
                    self.working = false;
                },
                function(response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        self.initialize = function (id) {

            if (!id) return;

            self.id = id;

            self.getCategories(true);
        };
    }
})();

(function () {
    'use strict';

    function profileCtrl($rootScope, $scope, core, alerts, io,  $timeout, utilities) {

        var self = this;
        var rootUrl = '/api/users/';

        self.isSelf = core.IsSelf();

        self.id = '';
        self.profile = null;
        self.password = {};
        self.message = '';
        self.mode = '';
        self.pendingChanges = false;
        self.working = false;

        self.userManager = {
            working: false,
            message: '',
            regex: '^[a-zA-Z1-9]+(\\.{1}[a-zA-Z1-9]+)?$'
        };

        self.zipCodeManager = {
            working: false,
            message: '',
            regex: '^\\d{5}(?:[-\\s]\\d{4})?$'
        };

        self.emailManager = {
            working: false,
            message: '',
            regex: '\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b'
        };

        self.show = function (mode) {
            if (mode === self.mode) return;
            self.mode = mode;
        };

        self.validateUsername = function() {

            if (!self.profile.username) return;

            self.userManager.working = true;
            self.userManager.message = '';

            var data = { username: self.profile.username };

            core.Post('/api/utilities/validateUsername', data)
                .then(function() {
                        self.userManager.working = false;
                        self.userManager.message = '';
                    },
                    function(response) {
                        self.userManager.working = false;
                        self.userManager.message = response.data.message || 'server error';
                    });
        };

        self.validateZipCode = function() {

            if (!self.profile.postalCode) return;

            self.zipCodeManager.working = true;
            self.zipCodeManager.message = '';

            core.Get('/api/utilities/validateZipCode/' + self.profile.postalCode)
                .then(function(response) {
                        self.zipCodeManager.working = false;
                        self.zipCodeManager.message = response.data.success ? '' : 'Invalid zip code';
                    },
                    function(response) {
                        self.zipCodeManager.working = false;
                        self.zipCodeManager.message = response.data.message || 'server error';
                    });
        };

        self.validateEmail = function() {

            if (!self.profile.emailAddress) return;

            self.emailManager.working = true;
            self.emailManager.message = '';

            var data = { emailAddress: self.profile.emailAddress };

            core.Post('/api/utilities/validateEmail', data)
                .then(function(response) {
                        self.emailManager.working = false;
                        self.emailManager.message = response.data.message || response.data.success
                            ? ''
                            : 'Invalid email address';
                    },
                    function(response) {
                        self.emailManager.working = false;
                        self.emailManager.message = response.data.message || 'server error';
                    });
        };

        self.lookUpsValid = function() {
            return !self.zipCodeManager.message && !self.userManager.message && !self.emailManager.message;
        };

        self.get = function() {
            core.Get(rootUrl + self.id + '/profile')
                .then(function(response) {
                        self.profile = response.data;
                        self.working = false;
                    },
                    function(response) {
                        alerts.ErrorAlert('Uh-oh!', response.data.message);
                        self.working = false;
                    });
        };

        self.add = function (url, id) {

            self.message = '';

            var isExternal = !!url;

            if (!isExternal) {
                if (!self.profile.emailAddress || !self.profile.password || !self.profile.confirmPassword) {
                    self.message = 'A valid email address and password are required';
                    return;
                }

                if (self.profile.emailAddress !== self.profile.emailAddressConfirm) {
                    self.message = 'Email addresses do not match';
                    return;
                }

                if (self.profile.password !== self.profile.confirmPassword) {
                    self.message = 'Passwords do not match';
                    return;
                }
            } else {
                if (!self.lookUpsValid()) {
                    self.message = 'Not all fields filled out correctly';
                    return;
                }

            }

            url = url || '/api/account/register';

            if (id) {
                self.profile.request = id;
            }

            self.working = true;

            core.Post(url, self.profile)
                .then(function () {
                        if (isExternal) {
                            window.location.replace('/');
                        } else {
                            self.mode = 'registerConfirm';
                        }
                    },
                    function (response) {
                        self.message = response.data.message;
                        self.working = false;
                    });
        };

        self.save = function(close) {

            self.working = true;

            core.Post(rootUrl + self.id, self.profile)
                .then(function() {

                        self.pendingChanges = false;

                        if (close) {
                            self.close();
                        } else {
                            alerts.SuccessAlert('All set!', 'Changes successfully saved');
                        }

                        self.working = false;
                    },
                    function(response) {
                        alerts.ErrorAlert('Uh-oh!', response.data.message);
                        self.working = false;
                    });
        };
  
        self.resetPassword = function () {

            if (!self.password.password) {
                alerts.ErrorAlert('Uh-oh!', 'Password cannot be blank.');
                return;
            }

            if (self.password.password !== self.password.confirmPassword) {
                self.message = 'Passwords do not match';
                return;
            }
            
            self.working = true;

            core.Post('/api/account/resetPassword', self.password)
                .then(function () {
                        alerts.SuccessAlert('All set!', 'Changes successfully saved');
                        self.password = {};
                        self.working = false;
                    },
                    function (response) {
                        alerts.ErrorAlert('Uh-oh!', response.data.message);
                        self.working = false;
                    });
        };

        self.completeRegistration = function() {
            self.working = true;

            self.profile.file = self.imageFile;
            self.profile.bio = '';

            io.upload({
                    url: '/api/account/completeProfile',
                    data: self.profile
                })
                .then(function() {
                        $timeout(function() {
                            window.location = '/';
                        });
                    },
                    function(response) {
                        self.message = response.data.message;
                        self.working = false;
                    });
        };

        self.close = function() {

            if (!self.PendingChanges) {
                window.location.replace('/u/' + self.profile.username);
                return;
            }

            alerts.WarningAlert('Are you sure?',
                'Looks like you have some unsaved changes',
                true,
                function() {
                    window.location.replace('/u/' + self.profile.username);
                });
        };

        self.closeModal = function() {
            $rootScope.modal.close();
        };

        var events = [
            $rootScope.$on('profile:save', function (event, data) {
                self.save(data);
            }),
            $rootScope.$on('password:save', function () {
                self.resetPassword();
            })
        ];

        $scope.$on('$destroy', function () {
            events.forEach(function (fn) {
                fn();
            });
        });

        self.initialize = function(id, prevent, mode) {
            self.id = id;

            self.show(mode);

            if (prevent) return;

            self.get();
        };
    }

    angular
        .module('selene')
        .controller('ProfileCtrl', profileCtrl);

    profileCtrl.$inject = ['$rootScope', '$scope', 'core', 'alerts', 'Upload', '$timeout', 'utilities'];
})();

(function () {
    'use strict';

    angular
        .module('selene')
        .controller('ProfileImageCtrl', profileCtrl);

    profileCtrl.$inject = ['Upload', 'core'];

    function profileCtrl(file, core) {

        var self = this;

        self.id = '';
        self.type = '';
        self.profile = {};

        self.validateFile = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles) {

            var fileCount = $invalidFiles.length;

            if (fileCount === 0) {
                self.imageError = false;
                return true;
            };

            var invalidFile = $invalidFiles[0];
            var messages = invalidFile.$errorMessages;

            self.imageError = true;

            if (messages.maxSize) {
                alert('That image is too big. Please choose an image smaller than 2mb.');
                return false;
            }

            if (messages.pattern) {
                alert('I don\'t know how to process that file. Please choose a GIF, JPEG, or PNG. Thanks!');
                return false;
            }

            alert('Looks like there was an error with this file.');

            return false;
        };

        self.uploadFile = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles) {

            if (!self.id || !self.validateFile($files, $file, $newFiles, $duplicateFiles, $invalidFiles)) return;

            self.working = true;

            self.profile.file = self.imageFile;

            file.upload({
                url: '/' + self.type + '/' + self.id,
                data: self.profile
            }).then(function () {
                    self.image = '/' + self.type + '/' + self.id + '?size=l&' + new Date().getTime(); ;
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        }

        self.initialize = function (id, type) {
            self.id = id;
            self.type = type;

            var parameters = [
                new core.Parameter('size', 'l'),
                new core.Parameter('v', moment().format('YYYYMMDDhhmmss'))
            ];

            self.image = core.MakeUrl('/' + type + '/' + id, parameters);
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('selene')
        .controller('SignUpCtrl', signupController);

    signupController.$inject = ['core', 'alerts', '$timeout']; 

    function signupController(core, alerts, $timeout) {

        var self = this;

        self.contact = {};
        self.working = false;
        self.section = '';

        self.addContact = function() {

            if (self.working) return;

            self.working = true;

            core.Post('/api/signup', self.contact)
                .then(function() {
                    self.section = 'thanks';
                        self.contact = {};
                    $timeout(function() {
                        self.section = '';
                    }, 5000);

                    self.working = false;
                },
                function(response) {
                    alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                    self.working = false;
                });
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('selene')
        .directive('cardBox', widget);

    widget.$inject = ['$templateCache'];

    function widget($templateCache) {

        var controller = ['$scope', function ($scope) {

            var self = this;

            self.title = $scope.title;
            self.subtitle = $scope.subtitle;
            self.cssClass = $scope.cssClass;
        }];

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                title: '@',
                subtitle: '@',
                cssClass: '@'
            },
            template: $templateCache.get('template/modals/cardBox.html'),
            controller: controller,
            controllerAs: 'cardBoxCtrl'
        };
    }
})();
app
    .directive('fgLine',
        function() {
            return {
                restrict: 'C',
                link: function() {
                    if ($('.fg-line')[0]) {
                        $('body')
                            .on('focus',
                                '.form-control',
                                function() {
                                    $(this).closest('.fg-line').addClass('fg-toggled');
                                })
                            .on('blur',
                                '.form-control',
                                function() {
                                    var p = $(this).closest('.form-group');
                                    var i = p.find('.form-control').val();

                                    if (p.hasClass('fg-float')) {
                                        if (i.length === 0) {
                                            $(this).closest('.fg-line').removeClass('fg-toggled');
                                        }
                                    } else {
                                        $(this).closest('.fg-line').removeClass('fg-toggled');
                                    }
                                });
                    }
                }
            };
        })
    .directive('selectPicker',
        function() {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    //if (element[0]) {
                    element.selectpicker();
                    //}
                }
            };
        })
    .directive('formControl',
        function() {
            return {
                restrict: 'C',
                link: function() {
                    if (angular.element('html').hasClass('ie9')) {
                        $('input, textarea')
                            .placeholder({
                                customClass: 'ie9-placeholder'
                            });
                    }
                }
            };
        });
(function() {

    'use strict';

    angular.module('seleneInterceptor', ['seleneLoader'])
    .config(['$httpProvider', function($httpProvider) {

        var interceptor = ['$q',
            '$cacheFactory',
            '$timeout',
            '$rootScope',
            '$log',
            'seleneLoader',
            function($q, $cacheFactory, $timeout, $rootScope, $log, sjmLoader) {

                var totalRequests = 0;
                var completedRequests = 0;
                var startTimeout;

                function setComplete() {
                    $timeout.cancel(startTimeout);
                    sjmLoader.complete();
                    completedRequests = 0;
                    totalRequests = 0;
                }

                function isCached(config) {
                    var cache;
                    var defaultCache = $cacheFactory.get('$http');
                    var defaults = $httpProvider.defaults;

                    if ((config.cache || defaults.cache) && config.cache !== false &&
                        (config.method === 'GET' || config.method === 'JSONP')) {
                        cache = angular.isObject(config.cache) ? config.cache
                            : angular.isObject(defaults.cache) ? defaults.cache
                            : defaultCache;
                    }

                    var cached = cache !== undefined ? cache.get(config.url) !== undefined : false;

                    if (config.cached !== undefined && cached !== config.cached) {
                        return config.cached;
                    }
                    config.cached = cached;
                    return cached;
                }

                return {
                    'request': function(config) {
                        if (!config.ignoreLoader && !isCached(config)) {
                            $rootScope.$broadcast('sjmLoader:loading', {url: config.url});

                            if (totalRequests === 0) {
                                startTimeout = $timeout(function() {
                                    sjmLoader.start();
                                }, 300);
                            }

                            totalRequests++;
                        }
                        return config;
                    },

                    'response': function(response) {
                        if (!response || !response.config) {
                            return response;
                        }

                        if (!response.config.ignoreLoader && !isCached(response.config)) {

                            completedRequests++;

                            $rootScope.$broadcast('sjmLoader:loaded', {url: response.config.url, result: response});
                            if (completedRequests >= totalRequests) {
                                setComplete();
                            }
                        }
                        return response;
                    },

                    'responseError': function(rejection) {

                        if (!rejection || !rejection.config) {
                            return $q.reject(rejection);
                        }

                        if (!rejection.config.ignoreLoader && !isCached(rejection.config)) {

                            completedRequests++;

                            $rootScope.$broadcast('sjmLoader:loaded', {url: rejection.config.url, result: rejection});

                            if (completedRequests >= totalRequests) {
                                setComplete();
                            }
                        }
                        return $q.reject(rejection);
                    }
                };
            }];

        $httpProvider.interceptors.push(interceptor);
    }]);

    angular.module('seleneLoader', [])
        .provider('seleneLoader', function () {

            var self = this;

            self.$get = [
                '$rootScope',
                '$timeout',
                function ($rootScope) {

                    function start() {
                        $('body').addClass('loading');
                        $rootScope.$broadcast('sjmLoader:started');
                    }

                    function complete() {
                            $('body').removeClass('loading');
                            $rootScope.$broadcast('sjmLoader:completed');
                    }

                    return {
                        start : start,
                        complete : complete
                    };
                }];
        });
})();

(function() {
    'use strict';

    function onEnter () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13 && !event.shiftKey) {
                    scope.$apply(function () {
                        scope.$eval(attrs.onEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }

    angular
        .module('selene')
        .directive('onEnter', onEnter);
})();
// ReSharper disable UseOfImplicitGlobalInFunctionScope

app
    .directive('btn',
        function() {
            return {
                restrict: 'C',
                link: function(scope, element) {
                    if (element.hasClass('btn-icon') || element.hasClass('btn-float')) {
                        Waves.attach(element, ['waves-circle']);
                    } else if (element.hasClass('btn-light')) {
                        Waves.attach(element, ['waves-light']);
                    } else {
                        Waves.attach(element);
                    }

                    Waves.init();
                }
            };
        })
    .directive('waves',
        function() {
            return {
                restrict: 'C',
                link: function(scope, element) {
                    Waves.attach(element);
                    Waves.init();
                }
            };
        })
    .directive('focusOn', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                $scope.$watch($attr.focusOn, function (focusVal) {
                    $timeout(function () {
                        focusVal ? $element[0].focus() : $element[0].blur();
                    });
                });
            }
        }
    });

(function() {
    'use strict';

    angular
        .module('selene')
        .directive('fieldMatch', fieldMatch);
    
    function fieldMatch() {

        var directive = {
            link: link,
            restrict: 'A',
            require: ['^ngModel', '^form']
        };

        function link(scope, element, attrs, ctrls) {

            var formController = ctrls[1];
            var ngModel = ctrls[0];
            var otherField = formController[attrs.fieldMatch];

            var getMatchValue = function () {
                return otherField.$viewValue;
            };

            scope.$watch(getMatchValue, function () {
                ngModel.$$parseAndValidate();
            });

            // if ng1.3+
            if (ngModel.$validators) {
                ngModel.$validators.fieldMatch = function (modelValue) {
                    return (!modelValue && !otherField.$modelValue) || (modelValue === otherField.$modelValue);
                };
            } else {
                ngModel.$parsers.push(function (value) {
                    ngModel.$setValidity('fieldMatch', (!value && !otherField.$viewValue) || value === otherField.$viewValue);
                    return value;
                });
            }

            otherField.$parsers.push(function (value) {
                ngModel.$setValidity('fieldMatch', (!value && !ngModel.$viewValue) || value === ngModel.$viewValue);
                return value;
            });
        }

        return directive;
    }

})();
(function() {
    'use strict';

    angular
        .module('selene')
        .directive('widget', widget);

    widget.$inject = ['$templateCache','core'];
    
    function widget ($templateCache) {

        var controller = ['$scope', function ($scope) {

            var self = this;

            self.title = $scope.title;
            self.editLink = $scope.editLink;
            self.cssClass = $scope.cssClass;
        }];

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                title: '@',
                editLink: '@',
                cssClass: '@'
            },
            template: $templateCache.get('template/widgets/widget.html'),
            controller: controller,
            controllerAs: 'widgetCtrl'
        };
    }
})();
// ReSharper disable UseOfImplicitGlobalInFunctionScope

app.service('alerts', [function () {

    toastr.options = {
        'closeButton': true,
        'debug': false,
        'newestOnTop': false,
        'progressBar': false,
        'positionClass': 'toast-bottom-right',
        'preventDuplicates': false,
        'onclick': null,
        'showDuration': '2000',
        'hideDuration': '2000',
        'timeOut': '2000',
        'extendedTimeOut': '2000',
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut'
    };

    var popup = function(title, text, type, isPrompt, callback) {

        toastr[type](text, title);

        if ($.isFunction(callback)) {
            callback();
        }

        swal.closeModal();
    };

    var warningAlert = function(title, text, isPrompt, callback) {
        popup(title, text, 'warning', isPrompt, callback);
    };

    var errorAlert = function(title, text, isPrompt, callback) {
        popup(title, text, 'error', isPrompt, callback);
    };

    var successAlert = function(title, text, isPrompt, callback) {
        popup(title, text, 'success', isPrompt, callback);
    };

    return {
        Popup: popup,
        ErrorAlert: errorAlert,
        WarningAlert: warningAlert,
        SuccessAlert: successAlert,
    };
}]);

app.factory('antiForgeryInterceptor', [
    function () {
        return {
            request: function (config) {

                var token = $('input:hidden[name="__RequestVerificationToken"]').val();

                if (!token || !token.length) return config;

                if (!config.headers)
                    config.headers = { __RequestVerificationToken: token };
                else
                    config.headers.__RequestVerificationToken = token;

                return config;
            }
        };
    }])
    .config([
        '$httpProvider',
        function ($httpProvider) {
        $httpProvider.interceptors.push('antiForgeryInterceptor');
    }]);
app.service('core', [
    '$rootScope',
    '$http',
    function($rootScope, $http) {

        var servers = {};

        var rootUrl = servers[$rootScope.ENVIRONMENT] || '';

        function parameter(k, v) {
            return { id: k, value: v };
        }

        function appendParams(url, params) {

            if (!params) {
                return url;
            }

            for (var i = 0, n = params.length; i < n; i++) {
                url += (i === 0 ? '?' : '&') + params[i].id + '=' + params[i].value;
            }

            return url;
        }

        function makeUrl(command, params) {
            var url = rootUrl + command;
            return appendParams(url, params);
        }

        function get(url, data) {
            if (!angular.isArray(data)) {
                return $http.get(url, { cache: false });
            }

            url = appendParams(url, data);

            return $http.get(url, { cache: false });
        }

        function post(url, data) {
            return $http.post(url, data, { cache: false });
        }

        function put(url, data) {
            return $http.put(url, data, { cache: false });
        }

        function remove(url, data) {
            if (!angular.isArray(data)) {
                return $http.delete(url, { cache: false });
            }

            url = appendParams(url, data);

            return $http.delete(url, { cache: false });
        }

        function jsonp(url) {
            return $http.jsonp(url, { cache: false });
        }

        function formatDate(input, format) {

            if (!input) return '';

            format = format || 'YYYY-MM-DDTHH:mm:ss';

            var date = moment(input, format);

            if (!date.isValid()) {
                date = moment(new Date(input));
            }

            return !date.isValid() ? input : date.format('MM/DD/YYYY');
        }

        function flatten(input, separator, key) {
            if (!input || !separator || !key || !angular.isArray(input)) {
                return input;
            }

            var arr = [];

            for (var i = 0, l = input.length; i < l; ++i) {
                arr.push(input[i][key]);
            }

            return arr.join(separator);
        }

        function execute(f) {
            if (angular.isFunction(f)) {
                f();
            }
        }

        function pendingChanges() {
            $rootScope.PendingChanges = true;
        }

        function clearChanges() {
            $rootScope.PendingChanges = false;
        }

        function parseErrorsByKey(data, key, noTrim) {

            if (!data || !key) return '';

            var errors = '';
            var group = data[key];

            if (!group && !angular.isArray(group)) return '';

            for (var i = 0, l = group.length; i < l; ++i) {
                errors += group[i] + (i < (l - 1) || noTrim ? '<br/>' : '');
            }

            return errors;
        }

        function parseError(data, key) {

            if (!data) return '';

            key = key || '';

            if (key) {
                return parseErrorsByKey(data, key, false);
            }

            var errors = '';
            var i = 0;
            var l = data.length;

            for (var prop in data) {
                if (!data.hasOwnProperty(prop)) continue;
                errors += parseErrorsByKey(data, prop, i < l - 1);
                i++;
            }

            return errors;
        }

        function colorScale(value, arr) {
            if (!value || !arr || !angular.isArray(arr)) return '';

            if (value <= arr[0])
                return 'text-success';

            if (value <= arr[1])
                return 'text-warning';

            if (value > arr[1])
                return 'text-danger';

            return '';
        }

        function calcDate(input) {
            var start = moment();
            var end = moment(new Date(input));
            var duration = moment.duration(start.diff(end));

            if (duration.asHours() > 24)
                return end.format('MMM DD \'YY');

            if (duration.asMinutes() > 60)
                return Math.floor(duration.asHours()) + 'h ago';

            if (duration.asSeconds() > 60)
                return Math.floor(duration.asMinutes()) + 'm ago';

            return Math.floor(duration.asSeconds()) + 's ago';
        }

        function currentUserId() {
            return document.getElementById('cid').value;
        }

        function targetUserId() {

            var element = document.getElementById('tid');

            if (element) {
                return element.value;
            } else {
                return currentUserId();
            }
        }

        function isAuthenticated() {
            return document.getElementById('auth').value === 'true';
        }

        function isSelf() {
            var element = document.getElementById('sid');

            if (element) {
                return element.value === 'true';
            } else {
                return false;
            }
        }

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        return {
            MakeUrl: makeUrl,
            Parameter: parameter,
            Get: get,
            Post: post,
            Put: put,
            Delete: remove,
            JsonP: jsonp,
            FormatDate: formatDate,
            Flatten: flatten,
            Execute: execute,
            PendingChanges: pendingChanges,
            ClearChanges: clearChanges,
            ParseErrors: parseError,
            ParseErrorsByKey: parseErrorsByKey,
            ColorScale: colorScale,
            CalcDate: calcDate,
            CurrentUserId: currentUserId,
            TargetUserId: targetUserId,
            IsAuthenticated: isAuthenticated,
            IsSelf: isSelf,
            GetUrlParameter: getUrlParameter
        };
    }]);

(function () {
    'use strict';

    function modal($rootScope, $uibModal) {
        
        function open(component, bindings, windowClass) {
            $rootScope.modal = $uibModal.open({
                windowClass: windowClass,
                component: component,
                resolve: bindings || {}
            });
        };

        function close() {
            $rootScope.modal.close();
        };

        return {
            Open: open,
            Close: close
        }
    }

    angular
    .module('selene')
    .service('modal', modal);

    modal.$inject = ['$rootScope', '$uibModal'];
})();
app.service('search', [
    function() {

        function parse(term) {

            term = term.toUpperCase().trim();
            term = term || '';

            if (!term) {
                return term;
            }

            var regex = /(?:")([^"]+)(?:")|([^\s"]+)(?=\s+|$)/g;
            var terms = [];
            var arr;

            while (arr === regex.exec(term)) {
                terms.push(arr[1] ? arr[1] : arr[0]);
            }

            return terms;
        }

        function judge(terms, input) {

            if (!terms || !input) {
                return false;
            }

            input = input.toString().toUpperCase();

            for (var i = 0, len = terms.length; i < len; ++i) {
                if (input.indexOf(terms[i]) > -1) {
                    return true;
                }
            }

            return false;
        }

        return {
            Parse: parse,
            Judge: judge
        };

    }]);

(function () {
    'use strict';

    function utilities(core, $q) {

        var self = this;

        self.urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*)))/;

        self.validateZipCode = function (value) {
            if (!value) return false;

            return self.validate('/api/utilities/validateZipCode/' + value, 'get', null, 'Invalid zip code');
        };

        self.validateUsername = function (value) {

            if (!value) return false;

            var username = { username: value };

            return self.validate('/api/utilities/validateUsername', 'post', username, null);
        };

        self.validateEmail = function (value) {
            if (!value) return false;

            var emailAddress = { emailAddress: value };

            return self.validate('/api/utilities/validateEmail', 'post', emailAddress, null);
        };

        self.validate = function(url, type, value, message) {

            var deferred = $q.defer();
            var call;

            switch (type.toLowerCase()) {
            case 'post':
                call = core.Post(url, value);
                break;
            case 'put':
                call = core.Put(url, value);
                break;
            default:
                call = core.Get(url, value);
                break;
            }

            call
                .then(function(data) {
                        deferred.resolve(data);
                    },
                    function(data) {
                        defer.resolve(data);
                    });

            var response = deferred.promise;

            if (response.statusCode === 200) {
                return response.data.success ? '' : message || response.data.message;
            } else {
                return response.data.message || 'server error';
            }
        };
    }

    angular
        .module('selene')
        .service('utilities', utilities);

    utilities.$inject = ['core', '$q'];

})();
(function () {
    'use strict';

    function listCtrl($rootScope, $scope, $sce, core, modal) {
        /* jshint validthis:true */
        var self = this;
        var userId = core.CurrentUserId();

        self.isSelf = core.CurrentUserId() === (self.list ? self.list.userId : null);
        
        self.working = false;
        self.message = '';
        self.mode = '';

        self.listTypes = [
            'FAVVE list',
            'Wish list',
            'Review Collection'
        ];

        self.get = function () {

            if (self.working) return;

            self.working = true;
            
            var url = '/api/users/' + self.list.userId + '/lists/';

            core.Get(url + self.list.id)
                .then(function (response) {
                    self.list = response.data;
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        self.save = function () {

            if (self.working) return;

            self.working = true;

            var url = '/api/users/' + userId + '/lists/';
            var isNew = !self.list.id;
            var event = isNew ? 'list:added' : 'list:updated';
            var promise = isNew
                ? core.Post(url, self.list)
                : core.Put(url + self.list.id, self.list);

            promise.then(function (response) {
                response.data.following = core.CurrentUserId() !== response.data.userId;
                $rootScope.$emit(event, response.data);
                self.working = false;
                self.close();
            },
            function (response) {
                self.message = response.data.message;
                self.working = false;
            });
        };

        self.delete = function () {

            if (self.working) return;

            self.working = true;

            var url = '/api/users/' + self.list.userId + '/lists/';
            var params = [new core.Parameter('removePosts', true)];
            var promise = core.Delete(url + self.list.id, params);

            promise.then(function () {
                $rootScope.$emit('list:deleted', self.list.id);
                self.working = false;
                self.close();
            },
            function (response) {
                self.message = response.data.message;
                self.working = false;
            });
        };

        self.edit = function () {
            var bindings = { list: function() { return self.list; } }

            modal.Open('listEditor', bindings, 'w-300');
        };

        self.follow = function () {
            var bindings = {
                list: function () { return self.list; },
                mode: function () { return self.list.isFollowing ? 'unfollow' : 'follow'; }
            }

            modal.Open('listFollow', bindings, 'w-300');
        };

        self.confirm = function () {
            var bindings = { list: function () { return self.list; } }
            modal.Open('listDelete', bindings, 'w-300');
        };

        self.share = function () {
            var bindings = { list: function () { return self.list; } }
            modal.Open('listShare', bindings, 'w-400');
        };

        self.close = function () {
            modal.Close();
        };

        self.cleanHtml = function (html) {
            return $sce.trustAsHtml(html);
        };

        self.calcDate = function (date) {
            return core.CalcDate(date);
        };

        var events = [
            $rootScope.$on('list:change', function (event, data) {

                self.list = data;
                self.isSelf = core.CurrentUserId() === (self.list ? self.list.userId : null);

                if (!data) return;

                self.get(data);
            }),
            $rootScope.$on('list:updated', function (event, data) {
                self.list = data;
            }),
            $rootScope.$on('list:follow', function (event, data) {
                if (self.list.id !== data.id) return;
                self.list.isFollowing = true;
            }),
            $rootScope.$on('list:unfollow', function (event, data) {
                if (self.list.id !== data.id) return;
                self.list.isFollowing = false;
            }),
        ];

        $scope.$on('$destroy', function() {
            events.forEach(function (fn) {
                fn();
            });
        });

        self.initialize = function () {
            self.list = self.resolve
                ? self.resolve.list || self.list || null
                : self.list || null;

            self.list = angular.copy(self.list);
        };

        self.initialize();
    }

    angular
    .module('selene')
    .controller('ListCtrl', listCtrl);

    listCtrl.$inject = ['$rootScope', '$scope', '$sce', 'core', 'modal'];
})();

(function () {
    'use strict';

    function listsCtrl($rootScope, $scope, core, modal) {
        /* jshint validthis:true */
        
        var self = this;
        var userId = core.TargetUserId();
        var url = '/api/users/' + userId + '/lists/';

        self.isSelf = core.IsSelf();

        self.list = '';
        self.lists = [];
        self.working = false;
        self.message = '';
        self.hasFollowing = false;

        self.text = {
            icon: '',
            item: '',
            single: ''
        };

        function setType(type) {

            type = type || self.type;

            switch (type) {
                case '0':
                    self.text.icon = 'mdi-star c-white';
                    self.text.item = 'FAVVE Lists';
                    self.text.single = 'FAVVE list';
                    break;
                case '1':
                    self.text.icon = 'mdi-gift c-white';
                    self.text.item = 'Wish Lists';
                    self.text.single = 'wish list';
                    break;
                case '2':
                    self.text.icon = 'mdi-pen c-white';
                    self.text.item = 'Review Lists';
                    self.text.single = 'review list';
                    break;
            }
        }

        function getLists (initial) {

            if (self.working) return;

            var params = [
                new core.Parameter('onlySelf', false)
            ];

            if (self.type > -1) {
                params.push(new core.Parameter('listType', self.type));
            }

            core.Get(url, params)
                .then(function (response) {
                    self.lists = response.data;
                    self.working = false;

                    for (var i = 0, l = self.lists.length; i < l; ++i) {
                        if (!self.lists[i].following) continue;
                        self.hasFollowing = true;
                        break;
                    }

                    if (!initial) return;

                    $rootScope.$emit('list:change', { id: initial });

                },
                function (response) {
                    self.message = response.data.message;
                    self.lists = [];
                    self.working = false;
                });
        };

        self.add = function () {

            var bindings = {
                list: function () { return { type: self.type}; }
            }

            modal.Open('listEditor', bindings, 'w-300');
        };

        self.open = function (list) {
            self.list = list;
            $rootScope.$emit('list:change', self.list);
        };

        var events = [
            $rootScope.$on('list:added', function (event, data) {
                self.list = data.id;
                self.lists.unshift(data);
                self.open(data);
            }),
            $rootScope.$on('list:updated', function (event, data) {
                for (var i = 0, l = self.lists.length; i < l; ++i) {
                    if (data.id !== self.lists[i].id) continue;
                    self.lists[i] = data;
                    break;
                }
            }),
            $rootScope.$on('list:follow', function (event, data) {
                self.lists.unshift(data);
                self.open(data);
            }),
            $rootScope.$on('list:unfollow', function (event, data) {
                var index = null;

                for (var i = 0, l = self.lists.length; i < l; ++i) {
                    if (data.id !== self.lists[i].id) continue;
                    index = i;
                    break;
                }

                self.lists.splice(index, 1);
            }),
            $rootScope.$on('list:deleted', function (event, data) {
                self.open();
                if (self.lists.length === 1) {
                    self.getLists();
                    self.list = {};
                    return;
                }

                for (var i = 0, l = self.lists.length; i < l; ++i) {
                    if (data !== self.lists[i].id) continue;
                    self.lists[i].deleted = true;
                    self.list = '';
                    break;
                }
            })
        ];

        $scope.$on('$destroy', function () {
            events.forEach(function (fn) {
                fn();
            });
        });

        self.initialize = function (userId, type) {
            self.userId = userId;
            self.type = type || 0;
            self.list = core.GetUrlParameter('listId') || null;
            setType(self.type);
            getLists(self.list);
        };

        if (self.init) {
            self.initialize(self.userId, self.type);
        }
    }

    angular
        .module('selene')
        .controller('ListsCtrl', listsCtrl);

    listsCtrl.$inject = ['$rootScope', '$scope', 'core', 'modal'];
})();

(function () {
    'use strict';

    function postCtrl($rootScope, $scope, $ocLazyLoad, $compile, core, alerts, io, modal) {

        $ocLazyLoad.load('summernote');

        var self = this;
        var urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*)))/;
        var url = '/api/users/' + core.TargetUserId();

        self.maxLength = 2500;

        self.options = {
            height: 175,
            focus: true,
            airMode: false,
            toolbar: [
                    ['edit', ['undo', 'redo']],
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontclr', ['color']],
                    ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                    ['view', ['fullscreen']]
            ],
            placeholder: 'Write your review here',
            callbacks: {
                onKeydown: function (e) {
                    var t = e.currentTarget.innerText;
                    if (t.trim().length >= self.maxLength) {
                        if (e.keyCode !== 8) e.preventDefault();
                    }
                },
                onKeyup: function (e) {
                    var t = e.currentTarget.innerText;
                    $('#postContent').text(self.maxLength - t.trim().length);
                },
                onPaste: function (e) {
                    var t = e.currentTarget.innerText;
                    var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                    var all = t + bufferText;

                    e.preventDefault();
                    document.execCommand('insertText', false, all.trim().substring(0, self.maxLength));
                    $('#postContent').text(self.maxLength - t.length);
                }
            }
        };

        self.isAuthenticated = core.IsAuthenticated();

        self.working = false;
        self.loading = false;
        self.editing = false;
        self.message = '';

        self.lists = [];
        self.categories = [];
        self.address = '';

        self.editor = {};

        self.priorities = [
            'Lowest', 'Low', 'Medium', 'High', 'Highest'
        ];

        function initPost() {

            var type = Number(self.type || 0);
            var list = self.list || self.lists[0] || {};

            self.post.rating = 3;

            switch (type) {
                case 0:
                    break;
                case 1:
                    self.post.list = list;
                    self.post.type = type;
                    self.post.priority = 'Medium';
                    self.post.quantity = 1;
                    self.post.owned = 0;
                    self.step = 1;
                    break;
                case 2:
                    break;
            }
        }

        function reset(keepTopic) {

            self.working = false;
            self.loading = false;
            self.message = '';
            self.hideTitle = false;
            self.address = '';

            self.editor = {
                step: 1,
                previousStep: 1,
                state: '',
                detailsMaxLength: 500,
                addressSet: false,
                errors: {},
                topicSearch: keepTopic ? self.editor.topicSearch : '',
                history: [],
                preview: {}
            };

            initPost();
        };

        function saveWishlist() {
            if (self.working) return;

            self.working = true;

            var isNew = !self.post.id;
            var event = isNew ? 'post:added' : 'post:updated';
            var promise = isNew
                ? io.upload({ url: url + '/posts', data: self.post })
                : io.upload({ url: url + '/posts/' + self.post.id, data: self.post });

            promise
            .then(function (response) {
                $rootScope.$emit(event, response.data);
                self.close();
                self.working = false;
            },
            function (response) {
                self.message = response.data.message;
                self.working = false;
            });
        }

        function saveFAVVE() {
            if (self.working) return;

            self.working = true;

            if (self.place) {
                self.post.address.vicinity = self.place.vicinity || '';
                self.post.address.website = self.place.website || '';
                self.post.address.types = self.place.types || [];
                self.post.address.name = self.place.name || '';
            }

            var isNew = !self.post.id;
            var event = isNew ? 'post:added' : 'post:updated';
            var promise = isNew
                ? io.upload({ url: url + '/posts', data: self.post })
                : io.upload({ url: url + '/posts/' + self.post.id, data: self.post });

            promise
            .then(function (response) {
                $rootScope.$emit(event, response.data);
                self.close();
                self.working = false;
            },
            function (response) {
                self.message = response.data.message;
                self.working = false;
            });
        }

        function saveReview() {

            if (self.working) return;

            self.working = true;

            if (self.place) {
                self.post.address.vicinity = self.place.vicinity || '';
                self.post.address.website = self.place.website || '';
                self.post.address.types = self.place.types || [];
                self.post.address.name = self.place.name || '';
            }

            var isNew = !self.post.id;
            var event = isNew ? 'post:added' : 'post:updated';
            var promise = isNew
                ? io.upload({ url: url + '/posts', data: self.post })
                : io.upload({ url: url + '/posts/' + self.post.id, data: self.post });

            promise
            .then(function (response) {
                $rootScope.$emit(event, response.data);
                self.close();
                self.working = false;
            },
            function (response) {
                self.message = response.data.message;
                self.working = false;
            });
        }

        function getLists (force) {

            if (!force && self.working) return;

            self.working = true;

            var params = [
                new core.Parameter('onlySelf', true)
            ];

            if (self.type !== null && self.type > -1) {
                params.push(new core.Parameter('listType', self.type));
            }

            core.Get(url + '/lists', params)
                .then(function (response) {

                    self.lists = response.data;
                    self.post.list = null;
                    self.working = false;
                },
                function (response) {
                    alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                    self.working = false;
                });
        };

        function getCategories (force) {

            if (!force && self.working) return;

            self.working = true;

            core.Get('/api/categories')
                .then(function (response) {
                    self.categories = response.data;
                    self.working = false;
                },
                    function (response) {
                        alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                        self.working = false;
                    });
        };

        function getPost(force, override) {

            if (!force && self.working) return;

            self.working = true;

            core.Get(url + '/posts/' + self.post.id)
                .then(function (response) {
                    self.post = response.data;

                    for (var i = 0, l = self.lists.length; i < l; ++i) {
                        if (self.lists[i].id !== self.post.list.id) continue;

                        self.post.list = self.lists[i];
                        break;
                    }

                    self.editor.hasAddress = !!self.post.address;
                    self.editor.hasWebsite = !!self.post.url;
                    self.working = false;
                    self.goToStep(override || 3);

                },
                function (response) {
                    alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                    self.working = false;
                });
        };

        function getTopic() {

            core.Get('/api/topics/' + self.topic)
                .then(function (response) {
                    self.goToStep(6, response.data);
                },
                function (response) {
                    alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                    self.working = false;
                    self.editor.state = 'empty';
                });
        }

        //Actions
        self.getTopics = function () {

            if (!self.editor.topicSearch.trim()) {
                self.topics = [];
                return;
            }

            if (self.working) return;

            self.working = true;
            self.editor.state = 'searching';

            var url = '/api/topics';

            var params = [
                new core.Parameter('query', self.editor.topicSearch.trim())
            ];

            core.Get(url, params)
                .then(function (response) {
                    self.topics = response.data;
                    self.working = false;
                    self.editor.state = response.data.length ? 'found' : 'empty';
                },
                function (response) {
                    alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                    self.working = false;
                    self.editor.state = 'empty';
                });
        };

        self.getWebsite = function (event) {

            var website;

            if (event) {
                website = event.originalEvent.clipboardData.getData('text/plain');
            } else {
                website = self.website;
            }

            self.editor.preview.hasMatch = false;

            var regex = new RegExp(urlRegex, 'ig');
            var isMatch = regex.test(website);

            if (!isMatch && website.indexOf('http') < 0) {
                website = 'http://' + website;
                isMatch = regex.test(website);
            }

            if (!isMatch) {
                self.editor.errors.urlMatch = true;
                return;
            }

            self.editor.searching = true;

            var command = '/api/utilities/htmlscraper?url=' + encodeURIComponent(website);

            core.Get(command)
                .then(function (response) {

                    var data = response.data;

                    if (data.error) {
                        self.message = data.error;
                        return;
                    }

                    self.message = '';

                    self.editor.preview.title = data.title;
                    self.editor.preview.description = data.description;
                    self.editor.preview.image = data.image ? data.image.url || '' : '';
                    self.editor.preview.url = data.url;
                    self.editor.preview.hasMatch = true;
                    self.editor.searching = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.editor.searching = false;
                });
        };

        self.save = function () {

            if (!self.post.list) {
                self.message = 'Please select or create a list to continue';
                return;
            } else {
                self.message = '';
            }

            switch (self.post.type + '') {
                case '0':
                    saveFAVVE();
                    break;
                case '1':
                    saveWishlist();
                    break;
                case '2':
                    saveReview();
                    break;
            }
        };

        self.delete = function() {
            if (self.working) return;

            self.working = true;

            core.Delete(url + '/posts/' + self.post.id)
                .then(function () {
                    $rootScope.$emit('post:deleted', self.post.id);
                    self.close();
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        //Editor
        self.goToStep = function (step, data, direction, override) {

            if (!direction) {
                self.editor.history.push(self.editor.step);
            }

            switch (step) {
                case 1:
                    reset(true);
                    break;
                case 2:
                    self.post.topic = data || { id: '', name: self.editor.topicSearch };
                    break;
                case 3:
                    var topic = self.post.topic ? self.post.topic.name : '';
                    self.post.title = self.post.title || topic || '';
                    if (!self.post.title) self.editor.showTitle = true;
                    break;
                case 6:
                    self.post.category = { id: data.categoryId, name: data.category, icon: data.icon, color: data.color };
                    self.post.topic = { id: data.id, name: data.name };
                    self.post.image = data.hasImage ? '/api/topics/' + data.id + '/image' : '';
                    self.post.address = data.address;
                    self.post.url = data.url;
                    self.post.title = data.name || '';
                    self.hideTitle = !!self.post.title && !self.post.type === 1;
                    self.post.content = data.content || '';
                    self.editor.hasAddress = !!data.address;
                    self.editor.hasWebsite = !!data.url;
                    step = override || 3;
                    break;
                case 7:
                    self.post.topic = { id: '', name: (self.editor.preview.title || '').substring(0, 255) };
                    self.post.title = (self.editor.preview.title || '').substring(0, 255);
                    self.post.content = self.editor.preview.description;
                    self.post.url = self.editor.preview.url;
                    self.post.image = self.editor.preview.image || '';
                    self.editor.hasAddress = false;
                    self.editor.hasWebsite = true;
                    self.hideTitle = !!self.post.title && !self.post.type === 1;
                    step = override || 3;
                    break;
                case 8:
                    self.post.topic = { id: '', name: self.place.name };
                    self.post.title = self.place.name;
                    self.post.url = self.place.website;
                    self.editor.hasAddress = true;
                    self.editor.hasWebsite = !!self.post.url;
                    self.hideTitle = !!self.post.title && !self.post.type === 1;
                    step = override || 3;
                    break;
                case 10:
                    self.post.category = direction ? self.post.category : data;
                    step = override || step;
                    break;
                case 11:
                    break;
            }

            self.editor.step = step;
        };

        self.previousStep = function () {

            var step = self.editor.history[self.editor.history.length - 1] || 1;

            if (self.editor.history.length) {
                self.editor.history.pop();
            }

            self.goToStep(step, null, true);
        };

        self.close = function () {
            modal.Close();
        };

        self.showOptional = function (type) {
            switch (type) {
                case 'website':
                    self.editor.showWebsite = !self.editor.showWebsite;

                    if (!self.editor.showWebsite) {
                        self.post.url = '';
                    }

                    break;

                case 'address':
                    self.editor.showAddress = !self.editor.showAddress;

                    if (!self.editor.showAddress) {
                        self.post.address = {};
                        self.place = null;
                    }

                    break;

                case 'tags':
                    self.editor.showTags = !self.editor.showTags;

                    if (!self.editor.showTags) {
                        self.post.tags = [];
                    }

                    break;
            }
        };

        //Utilities
        self.calcDate = function (date) {
            return core.CalcDate(date);
        };

        self.addList = function (input) {

            for (var i = 0, l = self.lists.length; i < l; ++i) {
                if (self.lists[i].id !== 0) continue;

                self.lists.splice(i, 1);
            }

            return {
                id: 0,
                name: input
            };
        };

        //Events
        var events = [
            $rootScope.$on('post:updated', function (event, data) {
                if (self.post.id !== data.id) return;

                self.post = data;
            }),
            $scope.$on('post:followed', function (event, data) {
                event.stopPropagation();
                self.post.isFollowing = data.isFollowing;
                self.post.followers = data.followers;
            }),
            $scope.$on('post:comment_added', function (event) {
                event.stopPropagation();
                self.post.commentCount += 1;
            }),
            $scope.$on('post:comment_removed', function (event) {
                event.stopPropagation();
                self.post.commentCount -= 1;
            }),
            $rootScope.$on('post:deleted', function (event, data) {
                if (self.post.id !== data) return;

                self.post.deleted = true;
            })
        ];

        $scope.$on('$destroy', function () {
            events.forEach(function (fn) {
                fn();
            });
        });

        self.initialize = function (force) {

            self.type = angular.copy(self.resolve
                ? self.resolve.type || self.type || null
                : self.type || 0);

            self.init = angular.copy(self.resolve
                ? self.resolve.init || self.init || null
                : self.init || false);

            self.mode = angular.copy(self.resolve
                ? self.resolve.mode || self.mode || null
                : self.mode || '');

            self.post = angular.copy(self.resolve
                ? self.resolve.post || self.post || null
                : self.post || {});

            self.topic = angular.copy(self.resolve
                ? self.resolve.topic || self.topic || null
                : self.topic || null);

            var userId = self.post && self.post.ownerId ? self.post.ownerId : core.TargetUserId();

            url = '/api/users/' + userId;

            if (!self.init && !force) return;

            reset();

            getLists(true);
            getCategories(true);

            if (self.post.id) {
                self.editing = true;
                switch(self.post.type + '') {
                    case '0':
                        getPost(true);
                        break;
                    case '1':
                        getPost(true, 3);
                        break;
                    case '2':
                        getPost(true);
                        break;
                }
                return;
            }

            if (self.topic) {
                self.editing = true;
                getTopic(); 
                return;
            }

            initPost();

        };

        self.initialize();
    }

    angular
        .module('selene')
        .controller('PostCtrl', postCtrl);

    postCtrl.$inject = ['$rootScope', '$scope', '$ocLazyLoad', '$compile', 'core', 'alerts', 'Upload', 'modal'];
})();

(function () {
    'use strict';

    function postEditorCtrl($rootScope, core, alerts, io) {

        var self = this;
        var urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*)))/;

        self.id = 0;
        self.working = false;
        self.loading = false;
        self.editing = true;
        self.message = '';

        self.lists = [];
        self.categories = [];
        self.address = '';

        self.editor = {};
        self.post = {};

        self.priorities = [
            'Lowest', 'Low', 'Medium', 'High', 'Highest'
        ];

        function initPost(type, list) {
            switch(type) {
                case 0:
                    break;
                case 1:
                    self.post = {
                        list: list || null,
                        type: type || 0,
                        data: {
                            priority: self.priorities[2],
                            quantity: 1,
                            owned: 0
                        }
                    };
                    break;
            }
        }

        function saveWishlist() {
            if (self.working) return;

            self.working = true;

            self.post.data = JSON.stringify(self.post.data);

            io.upload({
                url: '/api/users/' + self.id + '/posts',
                data: self.post
            })
            .then(function () {
                self.working = false;
            },
            function (response) {
                self.message = response.data.message;
                self.working = false;
            });
        }

        self.getLists = function (force) {

            if (!force && self.working) return;

            self.working = true;

            var url = '/api/users/' + self.id + '/lists';

            core.Get(url)
                .then(function (response) {

                        self.lists = response.data;

                        for (var i = 0, l = self.lists.length; i < l; ++i) {
                            self.lists[i].group = self.lists[i].type === 0 ? 'Favorites Lists' : 'Wish LIsts';
                        }

                        self.lists = response.data;
                        self.post.list = self.lists[0] || {};
                        self.working = false;
                    },
                    function (response) {
                        alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                        self.working = false;
                    });
        };

        self.getCategories = function (force) {

            if (!force && self.working) return;

            self.working = true;

            var url = '/api/categories';

            core.Get(url)
                .then(function (response) {
                        self.categories = response.data;
                        self.working = false;
                    },
                    function (response) {
                        alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                        self.working = false;
                    });
        };

        self.getTopics = function () {

            if (!self.editor.topicSearch.trim()) {
                self.topics = [];
                return;
            }

            if (self.working) return;

            self.working = true;
            self.editor.state = 'searching';

            var url = '/api/topics';

            var params = [
                new core.Parameter('query', self.editor.topicSearch.trim())
            ];

            core.Get(url, params)
                .then(function (response) {
                        self.topics = response.data;
                        self.working = false;
                        self.editor.state = response.data.length ? 'found' : 'empty';
                    },
                    function (response) {
                        alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                        self.working = false;
                        self.editor.state = 'empty';
                    });
        };

        self.getWebsite = function (event) {

            if (event) {
                self.website = event.originalEvent.clipboardData.getData('text/plain');
            }

            self.editor.preview.hasMatch = false;

            var regex = new RegExp(urlRegex, 'ig');
            var isMatch = regex.test(self.website);

            if (!isMatch) {
                self.editor.errors.urlMatch = true;
                return;
            }

            self.editor.searching = true;

            var command = '/api/utilities/htmlscraper?url=' + encodeURIComponent(self.website);

            core.Get(command)
                .then(function (response) {

                        var data = response.data;

                        if (data.error) {
                            alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + data.error);
                            return;
                        }

                        self.editor.preview.title = data.title;
                        self.editor.preview.description = data.description;
                        self.editor.preview.image = data.image.url || '';
                        self.editor.preview.url = data.url;
                        self.editor.preview.hasMatch = true;
                        self.editor.searching = false;
                    },
                    function (response) {
                        alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                        self.editor.searching = false;
                    });
        };

        self.addPost = function () {

            if (self.working) return;

            self.working = true;

            var url = '/api/users/' + self.id + '/posts';

            var interests = [];

            for (var i = 0, l = self.post.interests.length; i < l; ++i) {
                interests.push(self.post.interests[i].text);
            }

            var post = angular.copy(self.post);

            post.interests = interests;

            core.Post(url, post)
                .then(function () {
                        self.close();
                        self.working = false;
                    },
                    function (response) {
                        self.message = response.data.message;
                        self.working = false;
                    });
        };

        self.savePost = function() {

            if (self.working) return;

            self.working = true;

            if (self.place) {
                self.post.address.vicinity = self.place.vicinity || '';
                self.post.address.website = self.place.website || '';
                self.post.address.types = self.place.types || [];
                self.post.address.name = self.place.name || '';
            }

            io.upload({
                    url: '/api/users/' + self.id + '/posts',
                    data: self.post
                })
                .then(function(response) {
                        self.working = false;
                        $rootScope.$broadcast('event:post_added', response.data);
                        $rootScope.modal.close();
                    },
                    function(response) {
                        alerts.ErrorAlert('Uh-oh!', 'There was a server error: ' + response.data.message);
                        self.working = false;
                    });
        };

        self.save = function () {
            switch (self.post.type) {
                case 0:
                    break;
                case 1:
                    saveWishlist();
                    break;
            }
        };

        self.goToStep = function (step, data, direction, override) {

            if (!direction) {
                self.editor.history.push(self.editor.step);
            }

            switch (step) {
                case 1:
                    self.reset(true);
                    break;
                case 2:
                    self.post.topic = data || { id: '', name: self.editor.topicSearch };
                    break;
                case 3:
                    self.post.category = data;
                    break;
                case 6:
                    self.post.category = { id: data.categoryId, name: data.category, icon: data.icon, color: data.color };
                    self.post.topic = { id: data.id, name: data.name };
                    self.post.image = data.hasImage ? '/api/topics/' + data.id + '/image' : '';
                    self.post.address = data.address;
                    self.post.url = data.url;
                    self.editor.hasAddress = !!data.address;
                    self.editor.hasWebsite = !!data.url;
                    step = override || 3;
                    break;
                case 7:
                    self.post.topic = { id: '', name: (self.editor.preview.title || '').substring(0, 255) };
                    self.post.title = (self.editor.preview.title || '').substring(0, 255);
                    self.post.content = self.editor.preview.description;
                    self.post.url = self.editor.preview.url;
                    self.post.image = self.editor.preview.image || '';
                    self.editor.hasAddress = false;
                    self.editor.hasWebsite = true;
                    step = override || 2;
                    break;
                case 8:
                    self.post.topic = { id: '', name: self.place.name };
                    self.post.url = self.place.website;
                    self.editor.hasAddress = true;
                    self.editor.hasWebsite = !!self.post.url;
                    step = override || 2;
                    break;
            }

            self.editor.step = step;
        };

        self.previousStep = function () {

            var step = self.editor.history[self.editor.history.length - 1] || 1;

            if (self.editor.history.length) {
                self.editor.history.pop();
            }

            self.goToStep(step, null, true);
        };

        self.reset = function (keepTopic) {

            self.working = false;
            self.loading = false;
            self.editing = true;
            self.message = '';

            self.address = '';

            self.editor = {
                step: 1,
                previousStep: 1,
                state: '',
                detailsMaxLength: 500,
                addressSet: false,
                errors: {},
                topicSearch: keepTopic ? self.editor.topicSearch : '',
                history: [],
                preview: {}
            };

            self.post = {
                list: self.lists.length ? self.lists[0] : {}
            };
        };

        self.closeEditor = function () {
            self.reset();
            self.editing = false;
        };

        self.showOptional = function(type) {
            switch (type) {
            case 'website':
                self.editor.showWebsite = !self.editor.showWebsite;

                if (!self.editor.showWebsite) {
                    self.post.url = '';
                }

                break;

            case 'address':
                self.editor.showAddress = !self.editor.showAddress;

                if (!self.editor.showAddress) {
                    self.post.address = {};
                    self.place = null;
                }

                break;

            case 'tags':
                self.editor.showTags = !self.editor.showTags;

                if (!self.editor.showTags) {
                    self.post.tags = [];
                }

                break;
            }
        };

        self.initialize = function (id) {
            self.id = id;
            self.reset();
            self.getLists(true);
            self.getCategories(true);
        };

        self.inline = function (id, list, lists, type) {
            self.reset();

            self.id = id;
            self.lists = lists;
            self.mode = 'inline';

            initPost(type, list);
        };
    }

    angular
        .module('selene')
        .controller('PostEditorCtrl', postEditorCtrl);

    postEditorCtrl.$inject = ['$rootScope','core','alerts', 'Upload'];
})();

(function () {
    'use strict';

    function postsCtrl($rootScope, $scope, core, modal) {

        var self = this;

        self.isAuthenticated = core.IsAuthenticated();
        self.isSelf = false;

        self.working = false;
        self.message = '';

        self.posts = [];

        self.text = {
            icon: '',
            item: ''
        };

        self.startDate = new Date();
        self.empty = false;
        self.query = '';
        self.page = 1;

        self.category = '';

        self.filter = 'All';
        self.filters = [
            [],
            ['All', 'Purchased', 'Unpurchased']
        ];

        self.sort = 'Newest first';
        self.sorts = [
            [],
            ['Newest first', 'Oldest First', 'Priority']
        ];

        function reset() {
            self.posts = [];
            setType();
        }

        function setType(type) {

            type = type || self.type;

            switch (type + '') {
                case '0':
                    self.text.icon = 'mdi-star c-amber';
                    self.text.item = 'FAVVE';
                    break;
                case '1':
                    self.text.icon = 'mdi-gift c-red';
                    self.text.item = 'Wish List Item';
                    break;
                case '2':
                    self.text.icon = 'mdi-pen c-green';
                    self.text.item = 'Review';
                    break;
            }
        }

        function getPosts(force, notify, reset) {

            if (reset) {
                self.empty = false;
                self.startDate = new Date();
                self.posts = [];
            }

            if ((!force && self.working) || self.empty) return;

            self.working = true;

            var params = [];

            if (self.type && self.type > -1) {
                params.push(new core.Parameter('postType', self.type));
            }

            if (self.list && self.list.id) {
                params.push(new core.Parameter('list', self.list.id));
            }

            if (self.query) {
                params.push(new core.Parameter('query', self.query));
            }

            if (self.filter) {
                params.push(new core.Parameter('filter', self.filter.replace(' ', '-').toLowerCase()));
            }

            if (self.category) {
                params.push(new core.Parameter('category', self.category));
            }

            if (self.sort) {
                params.push(new core.Parameter('sortBy', self.sort.replace(' ', '-').toLowerCase()));
            }

            if (self.streamMode && self.stream) {
                params.push(new core.Parameter('streamType', self.streamMode));
                params.push(new core.Parameter('stream', self.stream));
            }

            params.push(new core.Parameter('page', self.page));

            self.isSelf = self.list ? self.list.userId === core.CurrentUserId() : core.IsSelf();

            var userId = self.list ? self.list.userId : core.TargetUserId();
            var url = self.mode !== 'stream' ? 
                '/api/users/' + userId + '/posts/' :
                '/api/posts/stream';

            core.Get(url, params)
                .then(function (response) {

                    var l = response.data.length;

                    for (var i = 0; i < l; ++i) {
                        self.posts.push(response.data[i]);
                    }

                    if (l === 0) {
                        self.empty = true;
                    } else {
                        self.page += 1;
                    }

                    if (notify) {
                        $scope.$emit('posts:search');
                    }

                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.posts = [];
                    self.working = false;
                });
        };

        //Event Handling
        self.add = function (type, topicId) {
            var bindings = {
                post: function () { return { type: type || self.type }; },
                topicId: function () { return topicId || null;  }
            }

            var width = type || self.type === '2' ? 'w-600' : 'w-500';

            modal.Open('postEditor', bindings, width);
        };

        self.search = function () {
            getPosts(true, true);
        };

        self.load = function() {
            getPosts();
        };

        self.filterBy = function (filter) {
            self.filter = filter;
            getPosts();
        };

        self.sortBy = function (sort) {
            self.sort = sort;
            getPosts();
        };

        var events = [
            $rootScope.$on('list:change', function (event, data) {
                self.list = data;
                self.category = '';
                self.page = 1;
                getPosts(true, false, true);
            }),
            $rootScope.$on('category:change', function (event, data) {
                self.category = data;
                self.page = 1;
                getPosts(true, false, true);
            }),
            $rootScope.$on('post:added', function (event, data) {
                self.posts.unshift(data);
            })
        ];

        $scope.$on('$destroy', function () {
            events.forEach(function (fn) {
                fn();
            });
        });

        //Initialization
        self.initialize = function () {

            self.type = self.resolve
                ? self.resolve.type || self.type || null
                : self.type || null;

            self.init = self.resolve
                ? self.resolve.init || self.init || null
                : self.init || null;

            self.mode = self.resolve
                ? self.resolve.mode || self.mode || null
                : self.mode || null;

            self.stream = self.resolve
                ? self.resolve.stream || self.stream || null
                : self.stream || null;

            self.streamMode = self.resolve
                ? self.resolve.streamMode || self.streamMode || null
                : self.streamMode || null;

            reset();

            if (!self.init) return;

            getPosts(true);
        };

        self.initialize();
    }

    angular
    .module('selene')
    .controller('PostsCtrl', postsCtrl);

    postsCtrl.$inject = ['$rootScope', '$scope', 'core', 'modal'];
})();

(function () {
    'use strict';

    function relationshipsCtrl($rootScope, $scope, core, modal) {
        /* jshint validthis:true */
        var self = this;
        var userId = core.CurrentUserId();

        self.isSelf = core.IsSelf();

        self.working = false;
        self.state = '';
        self.profiles = [];
        self.searchType = 'not';
        self.step = 1;
        self.page = 1;
        self.empty = false;
        self.limitTo = self.isSelf ? 8 : 9;
        self.direction = 'following';
        self.invite = {};

        function getProfile() {

            if (!self.target || self.working) return;

            core.Get('/api/users/' + self.target)
                .then(function (response) {
                    self.profile = response.data;
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.profile = {};
                    self.working = false;
                });
        }

        function getProfiles(auto) {

            if (self.working) return;

            self.working = true;
            self.state = 'searching';

            var params = [];

            if (self.query) {
                params.push(new core.Parameter('query', self.query));
            }

            if (self.page) {
                params.push(new core.Parameter('page', self.page));
            }

            if (self.limit) {
                params.push(new core.Parameter('pageSize', self.limit));
            }

            if (self.mode === 'mini') {
                params.push(new core.Parameter('randomize', 'true'));
            }

            var promise = self.type !== 3
                ? core.Get('/api/users/' + self.target + '/' + self.direction, params)
                : core.Get('/api/search/users', params);

            promise
                .then(function (response) {

                    var l = response.data.length;

                    for (var p = 0; p < l; ++p) {
                        self.profiles.push(response.data[p]);
                    }

                    if (self.mode === 'mini' && self.profiles.length < 9) {
                        for (var i = 0; i < 9; ++i) {
                            self.profiles.push(null);
                        }
                    }

                    self.working = false;
                    self.state = self.profiles.length ? '' : 'empty';
                    self.initialized = true;
                    self.empty = !response.data.length;

                    if (auto) {
                        self.page += 1;
                    }
                },
                function (response) {
                    self.message = response.data.message;
                    self.profile = {};
                    self.working = false;
                    self.state = '';
                });
        }

        function getRequest() {

            if (!self.request || self.working) return;

            core.Get('/api/users/notifications/' + self.request)
                .then(function (response) {

                    if (!response.data) {
                        self.step = 2;
                        return;
                    }

                    self.step = 1;

                    self.profile = { firstName: response.data.data.requestor };
                    self.target = response.data.sourceId;
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.profile = {};
                    self.target = null;
                    self.working = false;
                });
        }

        self.send = function () {

            var request = {
                sourceId: self.target,
                targetId: self.target,
                message: self.target
            };

            core.Post('/api/relationships/request/', request)
                .then(function () {
                    self.close();
                    self.working = false;
                    $rootScope.$emit('friend:requested', self.target);
                },
                function (response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        self.delete = function () {
            core.Delete('/api/users/' + core.CurrentUserId() + '/friends/' + self.profile.id)
                .then(function () {
                    $rootScope.$emit('friend:deleted', self.profile);
                    self.close();
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        self.process = function (action) {

            core.Get('/api/users/notifications/' + self.request + '/invite/' + action)
                .then(function () {
                    self.step = action === 'confirm' ? 3 : 4;
                    self.working = false;
                },
                function (response) {
                    self.message = response.data.message;
                    self.working = false;
                });
        };

        self.next = function () {
            console.log(self.empty);
            if (self.empty) return;
            getProfiles(true);
        };

        self.add = function (profile) {
            var bindings = {
                target: function () { return profile.id },
                init : function () { return true },
                mode : function () { return 'single' }
            }

            modal.Open('friendAction', bindings, 'w-300');
        };

        self.friendSearch = function () {
            var bindings = {
                mode : function () { return 'search'; },
                init : function () { return true; }
            };
            console.log('asdf');
            modal.Open('friendSearch', bindings, 'w-500');
        };

        self.remove = function(profile) {
            var bindings = {
                profile: function () { return profile || self.profile; },
                mode: function () { return 'delete'; },
                init: function () { return true; }
            }

            modal.Open('friendAction', bindings, 'w-300');
        };

        self.invite = function() {
            modal.Open('friendInvite', null, 'w-400');
        };

        self.close = function () {
            modal.Close();
        };

        self.calcDate = function(date) {
            return core.CalcDate(date);
        };

        self.search = function (auto, type) {

            self.searchType = type || self.searchType;

            getProfiles(auto);
        };

        self.follow = function (profile) {
            if (self.working) return;

            var p = profile || self.profile;
            var i = p.isFollowing ? -1 : 1;

            var target = p.isFollowing
                ? '/api/users/' + userId + '/unfollow/' + p.id
                : '/api/users/' + userId + '/follow/' + p.id;

            core.Get(target)
                .then(function () {
                    p.isFollowing = !p.isFollowing;
                    p.following = p.following + i;
                });
        };

        self.send = function () {
            if (self.working) return;

            var url = '/api/relationships/invite';

            core.Post(url, self.invite)
                .then(function () {
                    self.step = 3;
                    self.working = false;
                },
                    function (response) {
                        self.message = response.data.message;
                        self.working = false;
                    });
        };

        self.reset = function (step) {
            self.invite = {};
            self.step = step || 1;
        };

        self.goToStep = function(step) {
            switch(step) {
                case 1:
                    self.reset();
                    break;
                case 2:
                    self.invite = {};
                    break;
                case 3:
                    self.reset(step);
                    break;
            }

            self.step = step;
        };

        var events = [
            $rootScope.$on('friend:filter', function (event, data) {
                self.query = data.query;
                getProfiles();
            }),
            $rootScope.$on('friend:added', function (event, data) {
                self.profiles.unshift(data);
            }),
            $rootScope.$on('friend:requested', function (event, data) {
                for (var i = 0, l = self.profiles.length; i < l; ++i) {
                    if (data !== self.profiles[i].id) continue;
                    self.profiles[i].isFriend = 10;
                    break;
                }
            }),
            $rootScope.$on('friend:deleted', function (event, data) {

                if (self.profile.id !== data.id) return;
                self.profile.deleted = true;
            })
        ];

        $scope.$on('$destroy', function () {
            events.forEach(function (fn) {
                fn();
            });
        });

        self.initialize = function () {

            self.init = angular.copy(self.resolve
                ? self.resolve.init || self.init || false
                : self.init || false);

            self.target = angular.copy(self.resolve
                ? self.resolve.target || self.target || core.CurrentUserId()
                : self.target || core.CurrentUserId());

            self.request = angular.copy(self.resolve
                ? self.resolve.request || self.request || false
                : self.request || false);

            self.profile = angular.copy(self.resolve
                ? self.resolve.profile || self.profile || {}
                : self.profile || {});

            self.mode = angular.copy(self.resolve
                ? self.resolve.mode || self.mode || ''
                : self.mode || '');

            self.limit = angular.copy(self.resolve
                ? self.resolve.limit || self.limit || 20
                : self.limit || 20);

            if (!self.init) return;

            switch(self.mode) {
                case 'confirm':
                    self.type = 1;
                    self.step = 0;
                    getRequest();
                    break;
                case 'single' :
                    self.type = 2;
                    getProfile();
                    break;
                case 'search' :
                    self.type = 3;
                    break;
                case 'list' :
                    self.type = 4;
                    break;
                case 'mini':
                    self.type = 5;
                    getProfiles();
                    break;
                case 'card':
                    self.type = 6;
                    break;
                case 'delete':
                    self.type = 7;
                    self.target = self.profile.id;
                    break;
                case 'followers':
                    self.type = 8;
                    self.direction = 'followers';
                    break;
                case 'following':
                    self.type = 8;
                    self.direction = 'following';
                    break;
            }
        };

        self.initialize();
    }

    angular
        .module('selene')
        .controller('RelationshipsCtrl', relationshipsCtrl);

    relationshipsCtrl.$inject = ['$rootScope', '$scope', 'core', 'modal'];
})();

(function() {
    'use strict';

    angular
        .module('selene')
        .component('brandDelete', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                brand: '<'
            },
            controller: [
                '$rootScope', '$q', '$sce', 'core', 'modal', function ($rootScope, $q, $sce, core, modal) {
                    var self = this;
                    var userId = core.TargetUserId();
                    var url = '/api/users/' + userId + '/brands/';

                    self.working = false;
                    self.message = '';

                    self.delete = function () {

                        if (self.working) return;

                        self.working = true;

                        core.Delete(url + self.brand.id)
                            .then(function () {
                                $rootScope.$emit('brand:deleted', self.brand);
                                self.working = false;
                                modal.Close();
                            },
                            function (response) {
                                self.message = response.data.message;
                                self.working = false;
                            });
                    };

                    self.close = function () {
                        modal.Close();
                    };

                    self.initialize = function () {

                        self.brand = angular.copy(self.resolve
                            ? self.resolve.brand || self.brand || {}
                            : self.brand || {});
                    };

                    self.initialize();
                }
            ],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/brands/delete.html'
        });

})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('brandEditor',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                brand: '<'
            },
            controller: [
                '$rootScope', '$scope', '$q', '$sce', 'core', 'modal', function ($rootScope, $scope, $q, $sce, core, modal) {
                    var self = this;
                    var userId = core.TargetUserId();
                    var url = '/api/users/' + userId + '/brands/';
                    var regex = /^[0-9a-zA-zçáàãâéèêẽíìĩîóòôõúùũüûÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ ]*$/;

                    self.working = false;
                    self.message = '';
                    self.step = 0;
                    self.isNew = false;

                    self.levels = [
                        'Not rated',
                        'I like it',
                        'It\'s pretty cool',
                        'It\'s REALLY cool!',
                        'I LOVE this!',
                        'I\'m Obsessed!'
                    ];

                    self.save = function () {

                        if (self.working) return;

                        self.working = true;

                        var promise = self.isNew
                            ? core.Post(url, self.brand)
                            : core.Put(url + self.brand.id, self.brand);

                        var type = typeof self.temp;

                        if (self.isNew) {
                            switch (type) {
                                case 'string':
                                    self.brand.name = self.temp;
                                    break;
                                case 'object':
                                    self.brand.id = self.temp.id;
                                    self.brand.name = self.temp.name;
                                    break;
                                default:
                                    return;
                            }
                        }

                        promise
                            .then(function () {
                                $rootScope.$emit('brand:' + (self.isNew ? 'added' : 'updated'), self.brand);
                                self.working = false;
                                modal.Close();
                            },
                            function (response) {
                                self.message = response.data.message;
                                self.working = false;
                            });
                    };

                    self.search = function (query) {

                        var deferred = $q.defer();

                        if (!regex.test(query)) {
                            return deferred.promise;
                        }

                        self.working = true;

                        core.Get('/api/brands?pageSize=5&excludeUserbrands=true&query=' + query)
                            .then(function (response) {
                                deferred.resolve(response.data.data);
                                self.working = false;
                            },
                            function (response) {
                                self.message = response.data.message;
                                deferred.resolve([]);
                                self.working = false;
                            });

                        return deferred.promise;
                    };

                    self.select = function ($item) {
                        self.brand.id = $item.id;
                        self.brand.name = $item.name;
                    };

                    self.onkeypress = function ($event) {
                        if ($event.which !== 13) return;
                        self.save();
                    };


                    self.close = function() {
                        modal.Close();
                    };

                    self.colorScale = function (value, arr) {
                        return core.ColorScale(value, arr);
                    };

                    self.cleanHtml = function (html) {
                        return $sce.trustAsHtml(html);
                    };

                    self.initialize = function () {

                        self.brand = angular.copy(self.resolve
                            ? self.resolve.brand || self.brand || {}
                            : self.brand || {});

                        self.isNew = !self.brand.id;
                    };

                    self.initialize();
                }
            ],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/brands/editor.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('brandList',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                mode: '<',
                type: '@'
            },
            controller: [
                '$rootScope', '$scope', 'core', 'modal', function ($rootScope, $scope, core, modal) {
                    var self = this;
                    var userId = core.TargetUserId();

                    self.isSelf = core.IsSelf();
                    self.brands = [];
                    self.working = false;
                    self.message = '';

                    self.levels = [
                        'Not rated',
                        'I like it',
                        'It\'s pretty cool',
                        'It\'s REALLY cool!',
                        'I LOVE this!',
                        'I\'m Obsessed!'
                    ];

                    function getbrands() {

                        if (self.working) return;

                        self.working = true;

                        var params = [];

                        if (self.mode === 'mini') {
                            params.push(new core.Parameter('pageSize', 9));
                        }

                        var url = '/api/users/' + userId + '/brands';

                        core.Get(url, params)
                            .then(function (response) {
                                self.brands = response.data;
                                self.working = false;
                            },
                            function (response) {
                                self.message = response.data.message;
                                self.working = false;
                            });
                    }

                    self.edit = function (brand) {

                        var bindings = {
                            brand: function() { return brand || { name: '', reason: '', level: 1 }; }
                        };

                        modal.Open('brandEditor', bindings, 'w-400');
                    };

                    self.delete = function (brand) {
                        var bindings = {
                            brand: function () { return brand || { level: 1 }; }
                        };

                        modal.Open('brandDelete', bindings, 'w-400');
                    };

                    var events = [
                        $rootScope.$on('brand:added', function (event, data) {
                            self.brands.unshift(data);
                        }),
                        $rootScope.$on('brand:updated', function (event, data) {
                            for (var i = 0, l = self.brands.length; i < l; ++i) {
                                if (data.id !== self.brands[i].id) continue;
                                self.brands[i] = data;
                                break;
                            }
                        }),
                        $rootScope.$on('brand:deleted', function (event, data) {
                            for (var i = 0, l = self.brands.length; i < l; ++i) {
                                if (data.id !== self.brands[i].id) continue;
                                self.brands[i].deleted = true;

                                break;
                            }
                        })
                    ];

                    $scope.$on('$destroy', function () {
                        events.forEach(function (fn) {
                            fn();
                        });
                    });

                    self.initialize = function () {

                        self.mode = self.resolve
                            ? self.resolve.mode || self.mode || {}
                            : self.mode || {};

                        getbrands();
                    };

                    self.initialize();
                }
            ],
            controllerAs: 'ctrl',
            templateUrl: ['$element', '$attrs', function ($element, $attrs) {
                var type = ($attrs.type || 'list').toLowerCase();

                return 'assets/templates/brands/' + type + '.html';
            }]
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('chart',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                title: '@',
                url: '@',
                type: '@',
                id: '@',
                legend: '@'
            },
            controller: ['core', function (core) {

                Chart.defaults.global.maintainAspectRatio = false;

                var self = this;

                self.working = false;
                self.message = '';

                self.data = [];
                self.labels = [];
                self.series = [];
                self.total = 0;
                self.options = {
                    legend: {
                        display: !!self.legend,
                        position: 'right',
                        fullWidth: false,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)'
                        }
                    }
                };

                function populateHeader(data) {
                    self.total = data;
                }

                function populateSingleChart(data) {
                    self.data = data.data[0] || [];
                    self.labels = data.labels || [];
                    self.series = [];

                    self.total = self.data.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                }

                function populateMultiChart(data) {
                    self.data = data.data || [];
                    self.labels = data.labels || [];
                    self.series = data.series || [];

                    self.total = self.data[0].reduce(function (a, b) {
                        return a + b;
                    }, 0);
                }

                self.getData = function() {

                    if (self.working) return;

                    self.working = true;

                    core.Get(self.url)
                        .then(function(response) {
                            switch(self.type) {
                                case 'header':
                                    populateHeader(response.data);
                                    break;
                                case 'pie':
                                case 'doughnut':
                                    populateSingleChart(response.data);
                                    break;
                                case 'tableCategories':
                                    self.data = response.data;
                                    break;
                                default:
                                    populateMultiChart(response.data);
                                    break;
                            }
                        });

                }

                self.getData();

            }],
            controllerAs: 'ctrl',
            templateUrl: ['$element', '$attrs', function($element, $attrs) {
                var type = ($attrs.type || 'line').toLowerCase();

                return 'assets/templates/charts/' + type + '.html';
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('interestDelete', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                interest: '<'
            },
            controller: [
                '$rootScope', '$q', '$sce', 'core', 'modal', function ($rootScope, $q, $sce, core, modal) {
                    var self = this;
                    var userId = core.TargetUserId();
                    var url = '/api/users/' + userId + '/interests/';

                    self.working = false;
                    self.message = '';

                    self.delete = function () {

                        if (self.working) return;

                        self.working = true;

                        core.Delete(url + self.interest.id)
                            .then(function () {
                                $rootScope.$emit('interest:deleted', self.interest);
                                self.working = false;
                                modal.Close();
                            },
                            function (response) {
                                self.message = response.data.message;
                                self.working = false;
                            });
                    };

                    self.close = function () {
                        modal.Close();
                    };

                    self.initialize = function () {

                        self.interest = angular.copy(self.resolve
                            ? self.resolve.interest || self.interest || {}
                            : self.interest || {});
                    };

                    self.initialize();
                }
            ],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/interests/delete.html'
        });

})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('interestEditor',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                interest: '<'
            },
            controller: [
                '$rootScope', '$scope', '$q', '$sce', 'core', 'modal', function ($rootScope, $scope, $q, $sce, core, modal) {
                    var self = this;
                    var userId = core.TargetUserId();
                    var url = '/api/users/' + userId + '/interests/';
                    var regex = /^[0-9a-zA-zçáàãâéèêẽíìĩîóòôõúùũüûÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ ]*$/;

                    self.working = false;
                    self.message = '';
                    self.step = 0;
                    self.isNew = false;

                    self.levels = [
                        'Not rated',
                        'I like it',
                        'It\'s pretty cool',
                        'It\'s REALLY cool!',
                        'I LOVE this!',
                        'I\'m Obsessed!'
                    ];

                    self.save = function () {

                        if (self.working) return;

                        self.working = true;

                        var promise = self.isNew
                            ? core.Post(url, self.interest)
                            : core.Put(url + self.interest.id, self.interest);

                        if (self.isNew) {
                            var type = typeof self.temp;

                            switch (type) {
                                case 'string':
                                    self.interest.name = self.temp;
                                    break;
                                case 'object':
                                    self.interest.id = self.temp.id;
                                    self.interest.name = self.temp.name;
                                    break;
                                default:
                                    return;
                            }
                        }

                        promise
                            .then(function () {
                                $rootScope.$emit('interest:' + (self.isNew ? 'added' : 'updated'), self.interest);
                                self.working = false;
                                modal.Close();
                            },
                            function (response) {
                                self.message = response.data.message;
                                self.working = false;
                            });
                    };

                    self.search = function (query) {

                        var deferred = $q.defer();

                        if (!regex.test(query)) {
                            return deferred.promise;
                        }

                        self.working = true;

                        core.Get('/api/interests?pageSize=5&excludeUserInterests=true&query=' + query)
                            .then(function (response) {
                                deferred.resolve(response.data.data);
                                self.working = false;
                            },
                            function (response) {
                                self.message = response.data.message;
                                deferred.resolve([]);
                                self.working = false;
                            });

                        return deferred.promise;
                    };

                    self.select = function ($item) {
                        self.interest.id = $item.id;
                        self.interest.name = $item.name;
                    };

                    self.onkeypress = function ($event) {
                        if ($event.which !== 13) return;
                        self.save();
                    };


                    self.close = function() {
                        modal.Close();
                    };

                    self.colorScale = function (value, arr) {
                        return core.ColorScale(value, arr);
                    };

                    self.cleanHtml = function (html) {
                        return $sce.trustAsHtml(html);
                    };

                    self.initialize = function () {

                        self.interest = angular.copy(self.resolve
                            ? self.resolve.interest || self.interest || {}
                            : self.interest || {});

                        self.isNew = !self.interest.id;
                    };

                    self.initialize();
                }
            ],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/interests/editor.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('interestList',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                mode: '<'
            },
            controller: [
                '$rootScope', '$scope', 'core', 'modal', function ($rootScope, $scope, core, modal) {
                    var self = this;
                    var userId = core.TargetUserId();

                    self.isSelf = core.IsSelf();
                    self.interests = [];
                    self.working = false;
                    self.message = '';

                    self.levels = [
                        'Not rated',
                        'I like it',
                        'It\'s pretty cool',
                        'It\'s REALLY cool!',
                        'I LOVE this!',
                        'I\'m Obsessed!'
                    ];

                    function getInterests() {

                        if (self.working) return;

                        self.working = true;

                        var params = [];

                        if (self.mode === 'mini') {
                            params.push(new core.Parameter('pageSize', 9));
                        }

                        var url = '/api/users/' + userId + '/interests';

                        core.Get(url, params)
                            .then(function (response) {
                                self.interests = response.data;
                                self.working = false;
                            },
                            function (response) {
                                self.message = response.data.message;
                                self.working = false;
                            });
                    }

                    self.edit = function (interest) {

                        var bindings = {
                            interest: function() { return interest || { name: '', reason: '', level: 1 }; }
                        };

                        modal.Open('interestEditor', bindings, 'w-400');
                    };

                    self.delete = function (interest) {
                        var bindings = {
                            interest: function () { return interest || { level: 1 }; }
                        };

                        modal.Open('interestDelete', bindings, 'w-400');
                    };

                    var events = [
                        $rootScope.$on('interest:added', function (event, data) {
                            self.interests.unshift(data);
                        }),
                        $rootScope.$on('interest:updated', function (event, data) {
                            for (var i = 0, l = self.interests.length; i < l; ++i) {
                                if (data.id !== self.interests[i].id) continue;
                                self.interests[i] = data;
                                break;
                            }
                        }),
                        $rootScope.$on('interest:deleted', function (event, data) {
                            for (var i = 0, l = self.interests.length; i < l; ++i) {
                                if (data.id !== self.interests[i].id) continue;
                                self.interests[i].deleted = true;

                                break;
                            }
                        })
                    ];

                    $scope.$on('$destroy', function () {
                        events.forEach(function (fn) {
                            fn();
                        });
                    });

                    self.initialize = function () {

                        self.mode = self.resolve
                            ? self.resolve.mode || self.mode || {}
                            : self.mode || {};

                        getInterests();
                    };

                    self.initialize();
                }
            ],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/interests/list.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('listAction',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                request: '<'
            },
            controller: [
                '$rootScope', 'core', 'modal', function($rootScope, core, modal) {
                    var self = this;

                    self.working = false;
                    self.message = '';
                    self.step = 0;

                    function getRequest() {

                        if (!self.request || self.working) return;

                        core.Get('/api/users/notifications/' + self.request)
                            .then(function(response) {

                                    if (!response.data) {
                                        self.step = 2;
                                        return;
                                    }

                                    self.step = 1;

                                    self.profile = { firstName: response.data.data.requestor };
                                    self.list = { name: response.data.data.listName }
                                    self.target = response.data.sourceId;
                                    self.working = false;
                                },
                                function(response) {
                                    self.message = response.data.message;
                                    self.profile = {};
                                    self.target = null;
                                    self.working = false;
                                });
                    }

                    self.process = function(action) {

                        core.Get('/api/users/notifications/' + self.request + '/share/' + action)
                            .then(function() {
                                    self.step = action === 'confirm' ? 3 : 4;
                                    self.working = false;
                                },
                                function(response) {
                                    self.message = response.data.message;
                                    self.working = false;
                                });
                    };

                    self.request = self.resolve
                        ? self.resolve.request || self.request || {}
                        : self.request || {};

                    getRequest();
                }
            ],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/lists/action.html'
    });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('listCategories', {
            replace: true,
            transclude: true,
            bindings: {
                init: '<'
            },
            controller: ['$rootScope', '$scope', 'core', function ($rootScope, $scope, core) {

                var self = this;

                self.working = false;
                self.message = '';

                self.list = {};
                self.category = '';
                self.categories = [];

                self.get = function() {
                    if (self.working) return;

                    self.working = true;

                    core.Get('/api/users/' + self.list.userId + '/lists/' + self.list.id + '/categories')
                        .then(function(response) {
                            self.categories = response.data;
                            self.working = false;
                        },
                        function() {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.filter = function (categoryId) {
                    self.category = categoryId;
                    $rootScope.$emit('category:change', categoryId);
                };

                var events = [
                    $rootScope.$on('list:change', function (event, data) {
                        self.list = data;
                        self.category = '';
                        if (!data) return;

                        self.get();
                    })
                ];

                $scope.$on('$destroy', function () {
                    events.forEach(function (fn) {
                        fn();
                    });
                });
            }],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/lists/categories.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('listDelete', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                init: '<',
                list: '<'
            },
            controller: 'ListCtrl',
            controllerAs: 'listCtrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/lists/delete.html');
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('listDetails', {
            replace: true,
            transclude: true,
            bindings: {
                init: '<'
            },
            controller: 'ListCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/lists/details.html');
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('listEditor', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                init: '<',
                list: '<'
            },
            controller: 'ListCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/lists/editor.html');
            }]
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('listFollow',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                list: '<',
                mode: '@'
            },
            controller: [
                '$rootScope', 'core', 'modal', function($rootScope, core, modal) {
                    var self = this;
                    var userId = core.CurrentUserId();

                    self.working = false;
                    self.message = '';
                    self.step = 0;

                    self.process = function() {

                        core.Get('/api/users/' + userId + '/lists/' + self.list.id + '/' + self.mode)
                            .then(function() {
                                    self.working = false;
                                    modal.Close();
                                    $rootScope.$emit('list:' + self.mode, self.list);
                                },
                                function(response) {
                                    self.message = response.data.message;
                                    self.working = false;
                                });
                    };

                    self.close = function() {
                        modal.Close();
                    };

                    self.list = self.resolve
                        ? self.resolve.list || self.list || {}
                        : self.list || {};

                    self.mode = self.resolve
                        ? self.resolve.mode || self.mode || {}
                        : self.mode || {};
                }
            ],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/lists/follow.html'
    });
})();
(function() {
    'use strict';

    function lists($templateCache) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            bindToController: {
                type: '@',
                init: '@'
            },
            controller: 'ListsCtrl',
            controllerAs: 'listsCtrl',
            template: $templateCache.get('template/lists/list.html')
        };
    }

    angular
        .module('selene')
        .directive('lists', lists);

    lists.$inject = ['$templateCache'];
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('listShare', {
            replace: true,
            transclude: true,
            bindings: {
                resolve: '<',
                list: '<'
            },
            controller: ['$rootScope', 'core', 'modal', function($rootScope, core, modal) {
                var self = this;
                var userId = core.CurrentUserId();

                self.working = false;
                self.message = '';
                self.step = 1;
                self.limit = 5;

                self.query = '';
                self.profiles = [];
                self.profile = {};

                function getProfiles(auto) {

                    if (self.working) return;

                    self.working = true;

                    var params = [];

                    if (self.query) {
                        params.push(new core.Parameter('query', self.query));
                    }

                    if (self.page) {
                        params.push(new core.Parameter('page', self.page));
                    }

                    if (self.limit) {
                        params.push(new core.Parameter('pageSize', self.limit));
                    }

                    core.Get('/api/search/users', params)
                        .then(function (response) {
                            self.profiles = response.data;

                            if (self.mode === 'mini' && self.profiles.length < 9) {
                                for (var i = 0; i < 9; ++i) {
                                    self.profiles.push(null);
                                }
                            }

                            self.working = false;
                            self.initialized = true;

                            if (!self.profiles.length) {
                                self.empty = true;
                            }

                            if (auto) {
                                self.page += 1;
                            }
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.profile = {};
                            self.working = false;
                        });
                }

                self.lookup = function() {
                    if (self.working) return;

                    self.working = true;

                    var params = [];

                    params.push(new core.Parameter('email', self.email));

                    core.Get('/api/search/users', params)
                        .then(function (response) {
                            self.working = false;

                            if (response.data.length) {
                                self.profile = response.data[0];
                                self.goToStep(6);
                            } else {
                                self.share();
                            }

                        },
                        function (response) {
                            self.message = response.data.message;
                            self.profile = {};
                            self.working = false;
                        });
                };

                self.share = function () {

                    if (self.working) return;

                    self.working = true;

                    var url = '/api/users/' + userId + '/lists/' + self.list.id + '/share';

                    var notification = {
                        listId: self.list.id,
                        listName: self.list.name,
                        targetId: self.profile.id,
                        email: self.profile.id ? '' : self.email,
                        name: self.profile.id ? '' : self.name
                    };

                    core.Post(url, notification)
                        .then(function () {
                            self.step = 9;
                            self.working = false;
                        },
                        function(response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.goToStep = function (step, data) {

                    self.message = '';

                    switch(step) {
                        case 1:
                            self.query = '';
                            self.profiles = [];
                            self.email = '';
                            self.name = '';
                            self.profile = {};
                            break;
                        case 2:
                            getProfiles();
                            break;
                        case -2:
                            step = 2;
                            break;
                        case 3:
                            self.profile = data;
                            break;
                        case 5:
                            self.profile = {};
                            break;
                    }

                    self.step = step;
                }

                self.search = function() {
                    getProfiles();
                };

                self.close = function() {
                    modal.Close();
                };

                self.list = self.resolve
                    ? self.resolve.list || self.list || {}
                    : self.list || {};

                self.list = angular.copy(self.list);
            }],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/lists/share.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('notificationHeader', {
            replace: true,
            controller: ['core', function (core) {

                var self = this;

                self.working = false;
                self.results = {};

                function getNofications() {

                    if (self.working) return;

                    self.results = {};

                    var params = [
                        new core.Parameter('acknowledged', false)
                    ];

                    core.Get('/api/users/notifications/', params)
                        .then(function (response) {
                            self.results = response.data;
                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                }

                function acknowledge () {

                    var notificationId = self.results.data[0].id;

                    var params = [
                        new core.Parameter('notificationId', notificationId)
                    ];

                    core.Get('/api/users/notifications/acknowledgeAll/', params)
                        .then(function () {
                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                }

                self.clearNotifications = function () {
                    if (self.results.data.length) {
                        acknowledge();
                    } else {
                        window.location = '/settings/notifications';
                    }
                };

                self.calcDate = function (date) {
                    return core.CalcDate(date);
                };

                getNofications();
            }],
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/notifications/notificationHeader.html');
            }]
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('notifications', {
            replace: true,
            controller: ['core', function (core) {

                var self = this;

                self.working = false;
                self.results = {};
                self.summary = [];
                self.page = 1;

                self.type = null;
                self.types = [
                    { name: 'General', type: 0 },
                    { name: 'System Alerts', type: 1 },
                    { name: 'FAVVE Posts', type: 3 },
                    { name: 'Wish List Posts', type: 4 },
                    { name: 'Review Posts', type: 5 }
                ];

                function getNofications() {

                    if (self.working || self.page >= self.results.pages) return;

                    self.results = {};

                    var params = [];

                    if (self.type) {
                        params.push(new core.Parameter('type', self.type.type));
                    }

                    core.Get('/api/users/notifications/', params)
                        .then(function (response) {
                            self.results = response.data;
                            self.working = false;
                            self.page += 1;
                            acknowledge();
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                }

                function getSummary() {

                    core.Get('/api/users/notifications/summary')
                        .then(function (response) {
                            self.summary = response.data;

                            var l = self.summary.length;

                            self.total = 0;

                            self.types.forEach(function(type) {

                                type.count = 0;

                                for (var i = 0; i < l; ++i) {
                                    if (type.type !== self.summary[i].type) continue;
                                    type.count = self.summary[i].count;
                                    break;
                                }

                                self.total = self.total + type.count;
                            });
 
                        },
                        function (response) {
                            self.message = response.data.message;
                        });
                }

                function acknowledge() {

                    if (!self.results.data.length) return;

                    var notificationId = self.results.data[0].id;

                    var params = [
                        new core.Parameter('notificationId', notificationId)
                    ];

                    core.Get('/api/users/notifications/acknowledgeAll/', params);
                }

                self.open = function (type) {
                    self.type = type || null;
                    self.page = 1;
                    self.results = {};
                    getNofications();
                };

                self.next = function() {
                    getNofications();
                };

                self.clearNotifications = function () {
                    if (self.results.data.length) {
                        acknowledge();
                    } else {
                        window.location = '/settings/notifications';
                    }
                };

                self.calcDate = function (date) {
                    return core.CalcDate(date);
                };

                getSummary();
            }],
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/notifications/notifications.html');
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('posts', {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            bindings: {
                resove: '<',
                type: '<',
                mode: '<',
                init: '<',
                streamMode: '<',
                stream: '<'
            },
            controller: 'PostsCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/posts/posts.html');
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('about', {
            restrict: 'E',
            replace: true,
            controller: ['core', function (core) {

                var self = this;
                var rootUrl = '/api/users/' + core.TargetUserId() + '/';

                self.profile = {};
                self.bio = '';
                self.isSelf = core.IsSelf();

                self.initialized = false;
                self.editing = false;
                self.working = false;
                self.message = '';

                self.edit = function() {
                    self.editing = true;
                };

                self.cancel = function () {
                    self.bio = self.profile.bio ? angular.copy(self.profile.bio) : '';
                    self.editing = false;
                };

                self.get = function () {
                    core.Get(rootUrl + 'profile')
                        .then(function (response) {
                            self.profile = response.data;
                            self.bio = self.profile.bio ? angular.copy(self.profile.bio) : '';
                            self.working = false;
                            self.initialized = true;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.save = function () {

                    if (self.working) return;

                    self.working = true;
                    self.message = '';
                    self.profile.bio = self.bio;

                    core.Post(rootUrl + 'q/bio', { bio: self.profile.bio })
                        .then(function () {
                            self.editing = false;
                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.get();
            }],
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/profile/about.html');
            }]
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('addPassword',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                password: '<'
            },
            controller: ['$rootScope', function ($rootScope) {
                var self = this;

                self.resetPassword = function (close) {
                    $rootScope.$emit('password:save', close);
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/profile/add-password.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('editAddress',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                profile: '<'
            },
            controller: ['$rootScope', function ($rootScope) {
                var self = this;

                self.save = function (close) {
                    $rootScope.$emit('profile:save', close);
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/profile/edit-address.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('editProfile',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                profile: '<'
            },
            controller: ['$rootScope', '$scope', 'core', function ($rootScope, $scope, core) {
                var self = this;

                self.userManager = {
                    working: false,
                    message: '',
                    regex: '^[a-zA-Z1-9]+(\\.{1}[a-zA-Z1-9]+)?$'
                };

                self.emailManager = {
                    working: false,
                    message: '',
                    regex: '\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b'
                };

                self.validateUsername = function () {

                    if (!self.profile.username) return;

                    self.userManager.working = true;
                    self.userManager.message = '';

                    var data = { username: self.profile.username };

                    core.Post('/api/utilities/validateUsername', data)
                        .then(function () {
                            self.userManager.working = false;
                            self.userManager.message = '';
                        },
                            function (response) {
                                self.userManager.working = false;
                                self.userManager.message = response.data.message || 'server error';
                            });
                };


                self.validateEmail = function () {

                    if (!self.profile.emailAddress) return;

                    self.emailManager.working = true;
                    self.emailManager.message = '';

                    var data = { emailAddress: self.profile.emailAddress };

                    core.Post('/api/utilities/validateEmail', data)
                        .then(function (response) {
                            self.emailManager.working = false;
                            self.emailManager.message = response.data.message || response.data.success
                                ? ''
                                : 'Invalid email address';
                        },
                            function (response) {
                                self.emailManager.working = false;
                                self.emailManager.message = response.data.message || 'server error';
                            });
                };

                self.save = function (close) {
                    $rootScope.$emit('profile:save', close);
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/profile/edit-profile.html'
    });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('profileImage', {
            restrict: 'E',
            replace: true,
            transclude: true,
            bindings: {
                resolve: '<',
                type: '@',
                user: '@',
                size: '@',
                css: '@'
            },
            controller: ['Upload', 'core', function (file, core) {

                var self = this;

                self.working = '';
                self.message = '';

                self.validate = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles) {

                    var fileCount = $invalidFiles.length;

                    if (fileCount === 0) {
                        self.imageError = false;
                        return true;
                    };

                    var invalidFile = $invalidFiles[0];
                    var messages = invalidFile.$errorMessages;

                    self.imageError = true;

                    if (messages.maxSize) {
                        alert('That image is too big. Please choose an image smaller than 2mb.');
                        return false;
                    }

                    if (messages.pattern) {
                        alert('I don\'t know how to process that file. Please choose a GIF, JPEG, or PNG. Thanks!');
                        return false;
                    }

                    alert('Looks like there was an error with this file.');

                    return false;
                };

                self.upload = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles) {

                    if (!self.user || self.validate($files, $file, $newFiles, $duplicateFiles, $invalidFiles)) return;

                    self.working = true;

                    file.upload({
                        url: '/' + self.type + '/' + self.user,
                        data: { file: self.imageFile }
                    }).then(function () {
                        self.image = '/' + self.type + '/' + self.user + '?size=l&' + new Date().getTime();;
                        self.working = false;
                    },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                }

                self.initialize = function () {

                    self.user = self.resolve
                        ? self.resolve.id || self.user || null
                        : self.user || null;

                    self.type = self.resolve
                        ? self.resolve.type || self.type || null
                        : self.type || null;

                    self.size = self.resolve
                        ? self.resolve.size || self.size || 'l'
                        : self.size || 'l';

                    self.css = self.resolve
                        ? self.resolve.css || self.css || ''
                        : self.css || '';

                    var parameters = [
                        new core.Parameter('size', self.size),
                        new core.Parameter('v', moment().format('YYYYMMDDhhmmss'))
                    ];

                    self.image = core.MakeUrl('/' + self.type + '/' + self.user, parameters);
                }

                self.initialize();
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/profile/profile-image.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('registration', {
            restrict: 'E',
            replace: true,
            transclude: true,
            bindings: {
                resolve: '<',
                user: '@',
                css: '@'
            },
            controller: ['$rootScope', '$scope', 'core', 'modal', function ($rootScope, $scope, core, modal) {

                var self = this;

                self.id = '';
                self.profile = {};
                self.message = '';
                self.working = false;
                self.step = 0;
                self.postAdded = false;

                self.userManager = {
                    working: false,
                    message: '',
                    regex: '^[a-zA-Z1-9]+(\\.{1}[a-zA-Z1-9]+)?$'
                };

                self.zipCodeManager = {
                    working: false,
                    message: '',
                    regex: '^\\d{5}(?:[-\\s]\\d{4})?$'
                };

                self.emailManager = {
                    working: false,
                    message: '',
                    regex: '\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b'
                };

                self.validateUsername = function () {

                    if (!self.profile.username) return;

                    self.userManager.working = true;
                    self.userManager.message = '';

                    var data = { username: self.profile.username };

                    core.Post('/api/utilities/validateUsername', data)
                        .then(function () {
                            self.userManager.working = false;
                            self.userManager.message = '';
                        },
                            function (response) {
                                self.userManager.working = false;
                                self.userManager.message = response.data.message || 'server error';
                            });
                };

                self.validateZipCode = function () {

                    if (!self.profile.postalCode) return;

                    self.zipCodeManager.working = true;
                    self.zipCodeManager.message = '';

                    core.Get('/api/utilities/validateZipCode/' + self.profile.postalCode)
                        .then(function (response) {
                            self.zipCodeManager.working = false;
                            self.zipCodeManager.message = response.data.success ? '' : 'Invalid zip code';
                        },
                            function (response) {
                                self.zipCodeManager.working = false;
                                self.zipCodeManager.message = response.data.message || 'server error';
                            });
                };

                self.validateEmail = function () {

                    if (!self.profile.emailAddress) return;

                    self.emailManager.working = true;
                    self.emailManager.message = '';

                    var data = { emailAddress: self.profile.emailAddress };

                    core.Post('/api/utilities/validateEmail', data)
                        .then(function (response) {
                            self.emailManager.working = false;
                            self.emailManager.message = response.data.message || response.data.success
                                ? ''
                                : 'Invalid email address';
                        },
                            function (response) {
                                self.emailManager.working = false;
                                self.emailManager.message = response.data.message || 'server error';
                            });
                };

                self.lookUpsValid = function () {
                    return !self.zipCodeManager.message && !self.userManager.message && !self.emailManager.message;
                };

                self.get = function () {
                    core.Get('/api/users/' + self.user + '/profile')
                        .then(function (response) {
                            self.profile = response.data;
                            self.goToStep(1);
                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };
                
                self.add = function () {
                    var bindings = {};
                    bindings.post = function () { return { type: 0 }; };
                    modal.Open('postEditor', bindings, 'w-500');
                };

                self.completeRegistration = function () {

                    if (self.working) return;

                    self.working = true;

                    self.profile.bio = '';

                    core.Post('/api/account/completeProfile', self.profile)
                            .then(function () {
                                self.working = false;
                                self.goToStep(4);
                            },
                            function (response) {
                                self.goToStep(2);
                                self.message = response.data.message;
                                self.working = false;
                            });
                };

                self.goToStep = function(step) {
                    switch(step) {
                        case 3:
                            self.completeRegistration();
                            return;
                        case 5:
                            window.location.href = '/';
                            return;
                    }

                    self.step = step;
                }

                var events = [
                    $rootScope.$on('post:added', function () {
                        self.postAdded = true;
                    })
                ];

                $scope.$on('$destroy', function () {
                    events.forEach(function (fn) {
                        fn();
                    });
                });

                self.initialize = function () {

                    self.user = self.resolve
                        ? self.resolve.id || self.user || null
                        : self.user || null;

                    self.css = self.resolve
                        ? self.resolve.css || self.css || ''
                        : self.css || '';

                    self.get();
                }

                self.initialize();
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/profile/registration.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('resetPassword',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                password: '<'
            },
            controller: ['$rootScope', function ($rootScope) {
                var self = this;

                self.resetPassword = function (close) {
                    $rootScope.$emit('password:save', close);
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/profile/reset-password.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('securitySettings',
        {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                profile: '<'
            },
            controller: ['$rootScope', function ($rootScope) {
                var self = this;

                self.save = function (close) {
                    $rootScope.$emit('profile:save', close);
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/profile/security-settings.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('friendAction', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                target: '<',
                request: '<',
                init: '<',
                mode: '@'
            },
            controller: 'RelationshipsCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/relationships/action.html');
            }]
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('friendCard', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                profile: '<',
                init: '<',
                mode: '@'
            },
            controller: 'RelationshipsCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/relationships/card.html');
            }]
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('friendGrid', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                target: '<',
                init: '<',
                mode: '@',
                limit: '@'
            },
            controller: 'RelationshipsCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/relationships/grid.html');
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('friendInvite', {
            restrict: 'E',
            replace: true,
            controller: ['$rootScope', 'core', 'modal', function($rootScope, core, modal) {
                var self = this;
                var userId = core.CurrentUserId();

                self.step = 1;
                self.working = false;
                self.invite = {};

                self.send = function() {
                    if (self.working) return;

                    var url = '/api/relationships/invite';

                    core.Post(url, self.invite)
                        .then(function() {
                                self.step = 2;
                                self.working = false;
                            },
                            function(response) {
                                self.message = response.data.message;
                                self.working = false;
                            });
                };

                self.reset = function() {
                    self.invite = {};
                    self.step = 1;
                };

                self.close = function() {
                    modal.Close();
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/relationships/invite.html'
        });

})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('friendSearch', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                init: '<',
                mode: '@'
            },
            controller: 'RelationshipsCtrl',
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/relationships/search.html'
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('friendsList', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                target: '<',
                init: '<',
                mode: '@',
                limit: '@'
            },
            controller: 'RelationshipsCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/relationships/list.html');
            }]
        });

})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('isFollowing', {
            restrict: 'E',
            replace: true,
            bindings: {
                profile: '@',
                following: '@'
            },
            controller: ['core', function(core) {
                var self = this;
                var userId = core.CurrentUserId();
                var url = '/api/users/' + userId + '/';

                self.working = false;
                self.following = self.following || false;

                self.follow = function() {
                    if (self.working) return;

                    var target = self.following
                        ? url + '/unfollow/' + self.profile
                        : url + '/follow/' + self.profile;

                    core.Get(target)
                        .then(function() {
                            self.following = !self.following;
                        });
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/relationships/is-following.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('searchBar', {
            restrict: 'E',
            replace: true,
            bindings: {
                title: '@',
                url: '@',
                type: '@'
            },
            controller: ['$rootScope', 'core', function ($rootScope, core) {
                var self = this;

            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/search/bar.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('searchUi', {
            restrict: 'E',
            replace: true,
            bindings: {
                searching: '<'
            },
            controller: ['$rootScope', '$sce', 'core', 'modal', function ($rootScope, $sce, core, modal) {
                var self = this;

                self.query = '';

                self.counts = {
                    people: 0,
                    topics: 0,
                    tags: 0
                };

                self.message = {
                    people: '',
                    topics: '',
                    tags: ''
                };

                self.people = [];
                self.topics = [];
                self.tags = [];
                self.counts.total = 0;
                self.working = 0;

                function searchPeople() {

                    self.working += 1;

                    var params = [
                        new core.Parameter('query', self.query)
                    ];

                    core.Get('/api/search/users', params)
                        .then(function(response) {
                            self.people = response.data;
                            self.counts.people = response.data.length >= 10 ? '10+' : response.data.length;
                            self.counts.total += self.counts.people;
                            self.working -= 1;
                        },
                        function(response) {
                            self.message.people = response.data.message;
                            self.working -= 1;
                        });
                }

                function searchTopics() {

                    self.working += 1;

                    var params = [
                        new core.Parameter('query', self.query)
                    ];

                    core.Get('/api/search/topics', params)
                        .then(function (response) {
                            self.topics = response.data;
                            self.counts.topics = response.data.length >= 10 ? '10+' : response.data.length;
                            self.counts.total += self.counts.topics;
                            self.working -= 1;
                        },
                        function (response) {
                            self.message.people = response.data.message;
                            self.working -= 1;
                        });
                }

                function searchTags() {

                    self.working += 1;

                    var params = [
                        new core.Parameter('query', self.query)
                    ];

                    core.Get('/api/search/tags', params)
                        .then(function (response) {
                            self.tags = response.data;
                            self.counts.tags = response.data.length >= 10 ? '10+' : response.data.length;
                            self.counts.total += self.counts.tags;
                            self.working -= 1;
                        },
                        function (response) {
                            self.message.tags = response.data.message;
                            self.working -= 1;
                        });
                }

                self.add = function (type, topic) {

                    $rootScope.$emit('search:close');

                    var bindings = {
                        post: function () { return { type: type || self.type }; },
                        topic: function () { return topic || null; }
                    }

                    modal.Open('postEditor', bindings, 'w-500');
                };

                self.search = function () {
                    searchTopics();
                    searchPeople();
                    searchTags();
                };

                self.cleanHtml = function (html) {
                    return $sce.trustAsHtml(html);
                };

                self.close = function() {
                    $rootScope.$emit('search:close');
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/search/search.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('userTable',
        {
            restrict: 'E',
            replace: true,
            controller: ['core', function (core) {

                var self = this;

                self.working = false;
                self.message = '';

                self.data = [];
                self.total = 0;

                var predicate = function(tableState, item) {
                    var search = tableState.search;
                    var predicate = search.predicateObject || {};

                    return predicate[item] ? predicate[item]
                        .replace('string:', '')
                        .replace('number:', '')
                        : '';
                };

                self.get = function(tableState) {

                    if (self.working) return;

                    self.working = true;

                    //pagination
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;
                    var number = pagination.number || 10;
                    var page = (start / number) + 1;

                    //sorting
                    var sorting = tableState.sort;
                    var sortBy = sorting.predicate || '';
                    var sortDir = sorting.reverse  ? 'desc' : '';

                    //filters

                    var from = predicate(tableState, 'from');
                    var to = predicate(tableState, 'to');
                    var employeeId = predicate(tableState, 'employeeId');
                    var supervisorId = predicate(tableState, 'supervisorId');

                    //Set Parameters
                    var params = [];

                    params.push(new core.Parameter('pageSize', number));
                    params.push(new core.Parameter('page', page));

                    if (sortBy)
                        params.push(new core.Parameter('sortBy', sortBy));

                    if (sortDir)
                        params.push(new core.Parameter('sortDir', sortDir));

                    if (from)
                        params.push(new core.Parameter('from', from));

                    if (to)
                        params.push(new core.Parameter('to', to));

                    if (employeeId)
                        params.push(new core.Parameter('employeeId', employeeId));

                    if (supervisorId)
                        params.push(new core.Parameter('supervisorId', supervisorId));

                    core.Get('/api/admin/users', params)
                        .success(function (response) {
                            self.data = response.data;
                            self.total = response.total;
                            tableState.pagination.numberOfPages  = response.pages;
                            tableState.pagination.totalItemCount = response.total;
                            self.working = false;
                        })
                        .error(function(response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.formatDate = function(date) {
                   return core.FormatDate(date);
                };

            }],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/tables/user-table.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('newPosters', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                target: '<',
                init: '<',
                mode: '@',
                limit: '@'
            },
            controller: ['core', function (core) {
                var self = this;
                var url = '/api/utilities/trends/newPosters';
                var userId = core.CurrentUserId();

                self.profiles = [];
                self.working = false;
                self.message = '';

                function getItems() {

                    if (self.working) return;

                    var params = [
                        new core.Parameter('pageSize', 20)
                    ];

                    core.Get(url, params)
                        .then(function (response) {
                            self.profiles = response.data;
                            self.initialized = true;
                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                }

                self.follow = function (profile) {
                    if (self.working) return;

                    var p = profile || self.profile;
                    var i = p.isFollowing ? -1 : 1;

                    var target = p.isFollowing
                        ? '/api/users/' + userId + '/unfollow/' + p.id
                        : '/api/users/' + userId + '/follow/' + p.id;

                    core.Get(target)
                        .then(function () {
                            p.isFollowing = !p.isFollowing;
                            p.following = p.following + i;
                        });
                };

                getItems();
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/trends/newPosters.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('trendingWidget', {
            restrict: 'E',
            replace: true,
            bindings: {
                title: '@',
                url: '@',
                type: '@'
            },
            controller: ['core', function (core) {
                var self = this;
                var url = '/api/utilities/trends/' + self.url;

                self.items = [];
                self.working = false;
                self.message = '';

                function getItems() {
                    if (self.working) return;

                    core.Get(url)
                        .then(function (response) {
                            self.items = response.data;
                            self.initialized = true;
                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                }

                getItems();
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/trends/widget.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('topPosters', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                target: '<',
                init: '<',
                mode: '@',
                limit: '@'
            },
            controller: ['core', function(core) {
                var self = this;
                var url = '/api/utilities/trends/topPosters';
                var userId = core.CurrentUserId();

                self.profiles = [];
                self.working = false;
                self.message = '';

                function getItems() {

                    if (self.working) return;

                    core.Get(url)
                        .then(function (response) {
                            self.profiles = response.data;
                                self.initialized = true;
                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                }

                self.follow = function (profile) {
                    if (self.working) return;

                    var p = profile || self.profile;
                    var i = p.isFollowing ? -1 : 1;

                    var target = p.isFollowing
                        ? '/api/users/' + userId + '/unfollow/' + p.id
                        : '/api/users/' + userId + '/follow/' + p.id;

                    core.Get(target)
                        .then(function () {
                            p.isFollowing = !p.isFollowing;
                            p.following = p.following + i;
                        });
                };

                getItems();
            }],
            controllerAs: 'ctrl',
            templateUrl: '/assets/templates/trends/topPosters.html'
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('postComment', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                post: '<',
                comment: '<',
                parent: '<'
            },
            controller: ['$rootScope', '$scope', '$sce', 'core', function ($rootScope, $scope, $sce, core) {
                
                var self = this;

                self.post = self.resolve
                    ? self.resolve.post || self.post || {}
                    : self.post || {};

                self.comment = self.resolve
                    ? self.resolve.comment || self.comment || null
                    : self.comment || null;

                self.parent = self.resolve
                    ? self.resolve.parent || self.parent || null
                    : self.parent || null;

                var url = '/api/users/' + self.post.ownerId + '/posts/' + self.post.id + '/comments';

                self.isAuthenticated = core.IsAuthenticated();
                self.isSelf = self.post.ownerId === core.CurrentUserId();
                self.isReply = !!self.parent;

                self.working = false;

                self.delete = function () {

                    if (self.working) return;

                    self.working = true;

                    core.Delete(url + '/' + self.comment.id)
                        .then(function () {
                            self.comment.deleted = true;
                            self.working = false;
                            $scope.$emit('post:comment_removed');
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.follow = function () {

                    console.log('thig');

                    if (self.working) return;

                    self.working = true;

                    core.Get('/api/users/' + self.post.ownerId + '/posts/' + self.post.id + '/comments/' + self.comment.id + '/follow')
                        .then(function () {
                            self.comment.isFollowing = !self.comment.isFollowing;

                            var count = !self.comment.isFollowing ? self.comment.followers - 1 : self.comment.followers + 1;

                            self.comment.followers = count <= 0 ? 0 : count;

                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.calcDate = function (date) {
                    return core.CalcDate(date);
                };

                self.cleanHtml = function (html) {
                    return $sce.trustAsHtml(html);
                };

                var events = [
                    $scope.$on('comment:comment_added', function (event, data) {
                        if (self.isReply) return;
                        event.stopPropagation();
                        self.comment.comments.push(data);
                    }),
                    $scope.$on('comment:comment_removed', function (event, data) {

                    })
                ];

                $scope.$on('$destroy', function () {
                    events.forEach(function (fn) {
                        fn();
                    });
                });
            }],
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/posts/comments/comment.html');
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('postComments', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                post: '<',
                comment: '<',
                parent: '<'
            },
            controller: ['$rootScope', '$scope', '$sce', 'core', function ($rootScope, $scope, $sce, core) {

                var self = this;

                self.post = self.resolve
                    ? self.resolve.post || self.post || {}
                    : self.post || {};

                self.comment = self.resolve
                    ? self.resolve.comment || self.comment || null
                    : self.comment || null;

                self.parent = self.resolve
                    ? self.resolve.parent || self.parent || null
                    : self.parent || null;

                var url = '/api/users/' + self.post.ownerId + '/posts/' + self.post.id + '/comments';

                self.isAuthenticated = core.IsAuthenticated();
                self.isSelf = self.post.ownerId === core.CurrentUserId();
                self.isReply = !!self.comment;
                self.comments = [];

                self.working = false;

                self.get = function () {

                    if (self.working) return;

                    self.working = true;

                    core.Get(url)
                        .then(function (response) {
                            self.comments = response.data;
                            self.working = false;
                        },
                            function (response) {
                                self.message = response.data.message;
                                self.working = false;
                            });

                };

                var events = [
                    $scope.$on('comment:comment_added', function (event, data) {
                        if (self.isReply) return;
                        event.stopPropagation();
                        self.comments.push(data);
                    }),
                    $scope.$on('comment:comment_removed', function (event, data) {
                        
                    })
                ];

                $scope.$on('$destroy', function () {
                    events.forEach(function (fn) {
                        fn();
                    });
                });

                self.initialize = function () {
                    
                    if (self.comment) {
                        self.comments = self.comment.comments || [];
                        return;
                    }

                    if (!self.post.commentCount) return;

                    self.get();
                };

                self.initialize();
            }],
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/posts/comments/comments.html');
            }]
        });

})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('postCommentsNew', {
            restrict: 'E',
            replace: true,
            bindings: {
                post: '<',
                parent: '<',
                source: '<',
                onFollow: '&'
            },
            controller: ['$rootScope', '$scope', 'core', function ($rootScope, $scope, core) {
                
                var self = this;

                self.mode = self.mode || '';
                self.post = self.post || {};
                self.comment = self.comment || null;
                self.parent = self.source || null;

                var url = '/api/users/' + self.post.ownerId + '/posts/' + self.post.id + '/comments';

                self.isReply = !!self.parent;
                self.comment = {};
                self.working = false;

                self.add = function () {

                    if (self.working) return;

                    self.working = true;

                    if (self.isReply) {
                        self.comment.parentId = self.parent.id;
                    }

                    core.Post(url, self.comment)
                        .then(function (response) {
                            self.comment.parentId = null;
                            self.comment.body = '';
                            self.active = false;
                            self.working = false;
                            
                            $scope.$emit('comment:comment_added', response.data);
                            $scope.$emit('post:comment_added');
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.follow = function () {
                    self.onFollow();
                }
            }],
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/posts/comments/new.html');
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('postDelete', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                post: '<',
                list: '<',
                type: '<',
                init: '<'
            },
            controller: 'PostCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', '$attrs', function ($templateCache) {
                return $templateCache.get('template/posts/editor/delete.html');
            }]
        });

})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('postEditorContent', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                post: '<',
                list: '<',
                type: '<',
                init: '<',
                topic: '<'
            },
            controller: 'PostCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', '$attrs', function ($templateCache, $attrs) {
                var type = $attrs.type || '0';
                switch (type) {
                    case '1':
                        return $templateCache.get('template/posts/editor/wishlist.html');
                    case '2':
                        return $templateCache.get('template/posts/editor/review.html');
                    default:
                        return $templateCache.get('template/posts/editor/favve.html');
                }
            }]
        });

})();
(function() {
    'use strict';
    
    angular
        .module('selene')
        .component('postEditor', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                post: '<',
                list: '<',
                type: '<',
                topic: '<',
                init: '<'
            },
            controller : function() {
                var self = this;

                self.type = self.resolve
                    ? self.resolve.type || self.type || null
                    : self.type || null;

                self.init = self.resolve
                    ? self.resolve.init || self.init || null
                    : self.init || null;

                self.list = self.resolve
                    ? self.resolve.list || self.list || null
                    : self.list || null;

                self.post = self.resolve
                    ? self.resolve.post || self.post || null
                    : self.post || null;

                self.topic = self.resolve
                    ? self.resolve.topic || self.topic || null
                    : self.topic || null;
            },
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/posts/editor/editor.html');
            }]
        });
})();
(function() {
    'use strict';
    
    angular
        .module('selene')
        .component('postPurchase', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                post: '<'
            },
            controller : ['$rootScope', 'core', 'modal', function($rootScope, core, modal) {
                var self = this;

                self.step = 1;
                self.purchasing = 1;

                self.range = function (n) {

                    var array = [];

                    for (var i = 1; i <= n; ++i) {
                        array.push(i);
                    }

                    return array;
                };

                self.purchase = function() {
                    if (self.working) return;

                    self.working = true;

                    var url = '/api/users/' + self.post.ownerId + '/posts/' + self.post.id + '/purchase';

                    var data = {
                        postId: self.post.id,
                        purchasing: self.purchasing,
                        location: self.location
                    };

                    core.Post(url, data)
                        .then(function() {
                            self.step = 3;
                            self.working = false;
                        },
                        function(response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.post = self.resolve
                    ? self.resolve.post || self.post || null
                    : self.post || null;

                self.close = function() {
                    modal.Close();
                };
            }],
            controllerAs: 'ctrl',
            templateUrl: 'assets/templates/posts/editor/purchase.html'
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('postContent', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                post: '<',
                mode: '<',
                list: '<',
                type: '<',
                init: '<'
            },
            controller: ['$rootScope', '$sce', 'core', 'modal', function ($rootScope, $sce, core, modal) {
                var self = this;

                self.type = self.resolve
                    ? self.resolve.type || self.type || null
                    : self.type || null;

                self.init = self.resolve
                    ? self.resolve.init || self.init || null
                    : self.init || null;

                self.list = self.resolve
                    ? self.resolve.list || self.list || null
                    : self.list || null;

                self.post = self.resolve
                    ? self.resolve.post || self.post || null
                    : self.post || null;

                self.isAuthenticated = core.IsAuthenticated();
                self.isSelf = self.post.ownerId === core.CurrentUserId();
                self.ratings = [1, 2, 3, 4, 5];

                self.edit = function () {
                    var bindings = {
                        post: function () { return self.post; }
                    }

                    modal.Open('postEditor', bindings, 'w-500');
                };

                self.delete = function () {
                    var bindings = {
                        post: function () { return self.post; }
                    }

                    modal.Open('postDelete', bindings, 'w-300');
                };

                self.purchase = function () {
                    var bindings = {
                        post: function () { return self.post; }
                    }

                    modal.Open('postPurchase', bindings, 'w-400');
                };

                self.readMore = function () {

                    if (self.working) return;

                    self.working = true;

                    core.Get('/api/posts/' + self.post.id + '/content')
                        .then(function (response) {
                            self.post.fullContent = $sce.trustAsHtml(response.data);
                            self.post.summaryLength = 10000000;
                            self.working = false;
                        },
                        function (response) {
                            self.post.fullContent = 'Error: ' + response.data.message;
                            self.working = false;
                        });
                }

                self.follow = function () {
                    if (self.working) return;

                    self.working = true;

                    core.Get('/api/users/' + self.post.ownerId + '/posts/' + self.post.id + '/follow')
                        .then(function () {
                            self.post.isFollowing = !self.post.isFollowing;

                            var count = !self.post.isFollowing ? self.post.followers - 1 : self.post.followers + 1;

                            self.post.followers = count <= 0 ? 0 : count;

                            $scope.$emit('post:followed', self.post);

                            self.working = false;
                        },
                        function (response) {
                            self.message = response.data.message;
                            self.working = false;
                        });
                };

                self.calcDate = function (date) {
                    return core.CalcDate(date);
                };

                self.cleanHtml = function (html) {
                    return $sce.trustAsHtml(html);
                };

                self.add = function () {

                    var bindings = {
                        post: function () { return { type: self.post.type }; },
                        topic: function () { return self.post.topic.id; }
                    }

                    modal.Open('postEditor', bindings, 'w-500');
                };
            }],
            controllerAs: 'ctrl',
            template: ['$templateCache', '$attrs', function ($templateCache, $attrs) {
                var type = $attrs.type || '0';

                switch (type) {
                    case '1':
                        return $templateCache.get('template/posts/post/content-wishlist.html');
                    case '2':
                        return $templateCache.get('template/posts/post/content-review.html');
                    default:
                        return $templateCache.get('template/posts/post/content-favorite.html');
                }
            }]
        });
})();
(function () {
    'use strict';

    angular
        .module('selene')
        .component('postHeader', {
            restrict: 'E',
            replace: true,
            bindings: {
                post: '<'
            },
            controller: ['core', function (core) {
                var self = this;

                self.calcDate = function (date) {
                    return core.CalcDate(date);
                };
            }],
            controllerAs: 'ctrl',
            template: ['$templateCache', '$attrs', function ($templateCache, $attrs) {
                var mode = $attrs.mode || 'stream';

                switch(mode) {
                    case 'list':
                        return $templateCache.get('template/posts/post/header-small.html');
                    default:
                        return $templateCache.get('template/posts/post/header.html');
                }
            }]
        });
})();
(function() {
    'use strict';

    angular
        .module('selene')
        .component('post', {
            restrict: 'E',
            replace: true,
            bindings: {
                resolve: '<',
                post: '<',
                mode: '<',
                type: '<',
                init: '<'
            },
            controller: 'PostCtrl',
            controllerAs: 'ctrl',
            template: ['$templateCache', function ($templateCache) {
                return $templateCache.get('template/posts/post/post.html');
            }]
        });
})();