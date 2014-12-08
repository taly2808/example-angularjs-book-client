var app = angular.module('bookApp', ['ngResource']);

// Book Service
app.factory('Book', ['$resource', function($resource){
  return $resource('http://localhost:2403/books/:id', {id: '@id'},{ 
    update: {
      method: 'PUT'
    }
  });
}]);

//popupService
app.service('popupService', ['$window', function($window){
  this.showPopup = function(msg) {
    return $window.confirm(msg);
  }
}])

// controller
app.controller('bookMgrCtrl', ['$scope', 'Book', 'popupService', function($scope, Book, popupService) {

  $scope.displayMode = "list";
  $scope.currentBook = null;

  $scope.listBooks = function () {
    $scope.books = Book.query();
  }

  $scope.loadEditForm = function (book) {
    $scope.currentBook = book ? Book.get({id: book.id}) : {};
    $scope.displayMode = "edit";
  }

  $scope.cancelEditForm = function () {
    $scope.currentBook = null;
    $scope.displayMode = "list";
  }

  $scope.saveEditForm = function (book) {
    if (angular.isDefined(book.id)) {
      $scope.updateBook(book);
    } else {
      $scope.createBook(book);
    }
  }

  $scope.createBook = function (book) {   
   $scope.currentBook = new Book(book);
   $scope.currentBook.$save(function(newBook){
      $scope.listBooks();
      $scope.displayMode = "list";
   });
    
  }

  $scope.updateBook = function (book) {
    $scope.currentBook.$update(function(){
      $scope.listBooks();
      $scope.displayMode = "list";
    });
  }
  
  $scope.deleteBook = function (book) {
    if (popupService.showPopup('Are you sure delete this book?')){
      book.$delete();
      $scope.listBooks();
    };
  }

  $scope.listBooks();

}]);
