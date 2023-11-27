import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(cat => cat.id === product.categoryId); // find by product.categoryId
  const user = usersFromServer.find(u => u.id === category.ownerId); // find by category.ownerId

  return {
    ...product,
    category: { ...category },
    user: { ...user },
  };
});

function filterProducts(arrOfProducts,
  searchQuery,
  selectedUserFilter,
  selectedCategoryFilter) {
  if (!searchQuery && selectedUserFilter === 'All'
    && (!selectedCategoryFilter || selectedCategoryFilter === 'All')) {
    return arrOfProducts;
  }

  return arrOfProducts.filter((product) => {
    const preparedQuery = searchQuery.toLowerCase();
    const preparedProductName = product.name.toLowerCase();
    const preparedUserFilter = selectedUserFilter.toLowerCase();
    const preparedUserName = product.user.name.toLowerCase();
    const preparedCategoryTitle = product.category.title.toLowerCase();
    const preparedCategoryFilter = (selectedCategoryFilter
      && selectedCategoryFilter !== 'All')
      ? selectedCategoryFilter.toLowerCase()
      : null;

    return (
      (searchQuery ? preparedProductName.includes(preparedQuery) : true)
      && (selectedUserFilter === 'All'
        ? true : preparedUserName === preparedUserFilter)
      && (!preparedCategoryFilter
        || preparedCategoryTitle === preparedCategoryFilter)
    );
  });
}

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const visibleProducts = filterProducts(products,
    searchQuery,
    selectedUserFilter,
    selectedCategoryFilter);

  const resetFilter = () => {
    setSearchQuery('');
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedUserFilter('All');
    setSelectedCategoryFilter('All');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserFilter === 'All' ? 'is-active' : ''}
                onClick={() => setSelectedUserFilter('All')}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserFilter === user.name
                    ? 'is-active' : ''}
                  onClick={() => setSelectedUserFilter(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={resetFilter}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategoryFilter('All')}
              >
                All
              </a>
              {categoriesFromServer.map(cat => (
                <a
                  key={cat.id}
                  data-cy="Category"
                  className={`button mr-2 my-1${selectedCategoryFilter === 'button mr-2 my-1'
                    ? 'button is-success mr-6 is-outlined' : ''}`}
                  href="#/"
                  onClick={() => setSelectedCategoryFilter(cat.title)}
                >
                  {cat.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage" className="has-text-centered">
              No products matching selected criteria
            </p>
          ) : (
            <>
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map(product => (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {product.category.icon} - {product.category.title}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={product.user.sex === 'm'
                          ? 'has-text-link' : 'has-text-danger'}
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
