import { envConstants } from '../common/constants';
import * as apiModel from '../api';
import * as viewModel from '../view-models';

export const mapCarFromApiToVm = (car: apiModel.Car): viewModel.Car =>
  Boolean(car)
    ? {
        id: car.id,
        name: car.name,
        imageUrl: `${envConstants.BASE_PICTURES_URL}${car.imageUrl}`,
        features: car.features,
        isBooked: car.isBooked,
      }
    : {
        id: '',
        name: '',
        imageUrl: '',
        features: [],
        isBooked: false,
      };

export const mapCarListFromApiToVm = (
  carList: apiModel.Car[]
): viewModel.Car[] =>
  Array.isArray(carList) ? carList.map(mapCarFromApiToVm) : [];
