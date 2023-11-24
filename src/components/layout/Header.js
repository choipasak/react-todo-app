import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  return (
    <AppBar
      position='fixed'
      style={{
        background: '#38d9a9',
        width: '100%',
      }}
    >
      <Toolbar>
        <Grid
          justify='space-between'
          container
        >
          <Grid
            item
            flex={9}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant='h4'>오늘의 할일</Typography>
            </div>
          </Grid>

          <Grid item>
            <div className='btn-group'>
              {/* Link는 라우터가 제공하는 태그임.
                a태그와 다르게 Link태그를 누르면 라우터가 반응해서
                화면을 재렌더링하지 않고 이동이 가능하게 된다.
                게빌지 도구에는 a라고 나오지만 실제는 라우터가 작동함
                하나의 컴포넌트 안에서 바뀌면서 변화한다.
                실제 브라우저에서도 부드럽게 이동하는 것을 볼 수 있음.
                (a태그는 기능을 억제하고 이동까지 시켜줘야 했었음)
             */}
              <Link to='/login'>로그인</Link>
              <Link to='/join'>회원가입</Link>
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;