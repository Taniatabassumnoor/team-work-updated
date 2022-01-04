import React, { useState, useEffect } from 'react';

// import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import { getCategories, list } from './apiCore';
import Card from './Card';

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
//   tField: {
//     width: 800,
//     marginTop: 2,
//   },
//   root: {
//     '& > *': {
//       margin: theme.spacing(2),
//     },
//   },
// }));

const Search = () => {
  const useStyles = makeStyles((theme) => ({
    btn: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      marginLeft:"45%",
      borderRadius: 3,
      border: 0,
      color: 'white',
      marginTop:"1%",
      height: 50,
      padding: '0 20px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  }));
const classes = useStyles();
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = () => {
    // console.log(search, category);
    if (search) {
      list({ search: search || undefined, category: category }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `Search: No products found`;
    }
  };

  const searchedProducts = (results = []) => {
    return (
      <div className='row'>
        <div className='col-md-1'></div>
        <div className='col-md-10'>
          <h2 className='mt-4 mb-4 text-center'>{searchMessage(searched, results)}</h2>
          <div className='row'>
            {results.map((product, i) => (
              <div className='col-md-4 mb-3'>
                <Card key={i} product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className='col-md-1'></div>
      </div>
    );
  };

  // const classes = useStyles();

  const searchForm = () => (
    <form style={{width:"75%",marginRight:"8%"}} onSubmit={searchSubmit} >
      <span style={{backgroundColor:"transparent",border:"none",marginTop:"5%"}} className='input-group-text'>
        <div style={{marginRight:"5%"}} className='input-group input-group-lg'>
          <div style={{marginRight:"5%"}}  className='input-group-prepend'>
            <FormControl >
              <InputLabel style={{marginLeft:"5%"}} id='demo-simple-select-helper-label'>
                Select
              </InputLabel>
              <Select
                
                labelId='demo-simple-select-placeholder-label-label'
                id='demo-simple-select-placeholder-label'
                value={data.name}
                onChange={handleChange('category')}
                displayEmpty
                
              >
                <MenuItem  value='All'>
                  <em>All</em>
                </MenuItem>
                {categories.map((c, i) => (
                  <MenuItem key={i} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <TextField
          style={{width:"75%",paddingRight:"5%"}}
            onChange={handleChange('search')}
            id='outlined-basic'
            label={<span><SearchIcon style={{color:"#ff9900"}}/>Search by name</span>}
            variant='outlined'
            
            autoComplete='off'
          />

          <div  >
          
            <Button type='submit' style={{marginLeft:"20%"}}  variant='contained' className={classes.btn}>
            Search
        </Button>
          </div>
        </div>
      </span>
    </form>
  );

  return (
    <div className='row'>
      <div className='container mb-3'>{searchForm()}</div>
      <div className='container-fluid mb-3'>{searchedProducts(results)}</div>
    </div>
  );
};

export default Search;
