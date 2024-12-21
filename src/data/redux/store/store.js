import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../CurrentUserInfo'

const store = configureStore({

    reducer: {
      data: dataReducer, 
    },
    
  });
  
  export default store;