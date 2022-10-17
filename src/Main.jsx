import React, { useState, useEffect, useCallback } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Input,
  InputGroup,
  Button,
} from 'reactstrap';
import debounce from 'lodash.debounce';
import axios from 'axios';
const ITEMS_API_URL = 'https://cwbarry.pythonanywhere.com/product/';
const DEBOUNCE_DELAY = 2000;

export default function Autocomplete() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');

  const getData = (search) => {
    search.length > 3 &&
      axios.get(`${ITEMS_API_URL}?search=${search}`).then((res) => {
        console.log(res.data);
        setData(res.data.map((item) => item.title));
      });
  };

  const debouncedSearch = React.useRef(
    debounce(async (criteria) => {
      getData(criteria);
    }, DEBOUNCE_DELAY)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // const changeHandler = (search) => {
  //   getData(search);
  // };

  // const debouncedChangeHandler = useCallback(
  //   debounce(changeHandler, DEBOUNCE_DELAY),
  //   []
  // );

  return (
    <div className="container">
      <div class="row justify-content-md-center m-3">
        <h1>Auto Complete</h1>
      </div>
      <div class="row justify-content-md-center m-3">
        <div class="col-4">
          <h3>{query}</h3>
          <InputGroup>
            <Input
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedSearch(e.target.value);
              }}
              type="text"
              className="input"
              value={query}
            />
            <Button
              onClick={() => {
                setQuery('');
                setData([]);
              }}
              color="danger"
            >
              Clear!
            </Button>
          </InputGroup>

          {/* <input
            onChange={(e) => {
              setQuery(e.target.value);
              debouncedChangeHandler(e.target.value);
            }}
            type="text"
            className="input"
            value={query}
          /> */}
        </div>
      </div>
      <div class="row justify-content-md-center">
        <div class="col-4">
          <ListGroup>
            {data?.map((item, index) => (
              <ListGroupItem key={index}>{item}</ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}
