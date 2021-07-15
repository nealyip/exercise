/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'BrandsController.index');
  Route.get('/:id', 'BrandsController.getOne').where('id', /^[0-9]+$/);
  Route.post('/', 'BrandsController.create');
  Route.patch('/:id', 'BrandsController.edit').where('id', /^[0-9]+$/);
  Route.delete('/:id', 'BrandsController.delete').where('id', /^[0-9]+$/);
}).prefix('/brands');

Route.group(() => {
  Route.get('/', 'SportsController.index');
  Route.get('/:id', 'SportsController.getOne').where('id', /^[0-9]+$/);
  Route.post('/', 'SportsController.create');
  Route.patch('/:id', 'SportsController.edit').where('id', /^[0-9]+$/);
  Route.delete('/:id', 'SportsController.delete').where('id', /^[0-9]+$/);
}).prefix('/sports');

Route.group(() => {
  Route.get('/', 'ProductsController.index');
  Route.get('/:id', 'ProductsController.getOne').where('id', /^[0-9]+$/);
  Route.post('/', 'ProductsController.create');
  Route.patch('/:id', 'ProductsController.edit').where('id', /^[0-9]+$/);
  Route.delete('/:id', 'ProductsController.delete').where('id', /^[0-9]+$/);
}).prefix('/products');

Route.group(() => {
  Route.get('/:id', 'ProductOptionsController.getOne').where('id', /^[0-9]+$/);
  Route.post('/', 'ProductOptionsController.create');
  Route.patch('/:id', 'ProductOptionsController.edit').where('id', /^[0-9]+$/);
  Route.delete('/:id', 'ProductOptionsController.delete').where('id', /^[0-9]+$/);
}).prefix('/product-options');
