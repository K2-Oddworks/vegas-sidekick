// Vegas Sidekick — Header Component
// Drop <div id="vs-header"></div> at top of body + <script src="/components/header.js"></script>
(function() {
  const html = `
<nav id="vs-nav">
  <canvas id="vs-logo-orbs" style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0;"></canvas>
  <a class="nav-logo" href="/" style="position:relative;z-index:1;display:flex;align-items:center;text-decoration:none;"><img src="data:image/webp;base64,UklGRsYeAABXRUJQVlA4WAoAAAAQAAAAogAAnwAAQUxQSA0KAAABv8egbSNJ6/Cnve8dgIjI4S/5KttcJcg+U14lGLSN5Ggn833/+APuxyCi/xMQfUtHv+c1ryXR3cMiWFfWaJeqHIkIW0eE3dKBdbSoG1SAxIxK6zhav2GgrmADS+BZA5IWJZlZJZkqABv+f4Yk2fr+IjKrPT3TY9tr7w6Orm3btm3btu89tm3bsx6rrYz4v+iurIzMyr7nZURMAP0590BYZg07vPHUU/Js9rXvOhfXKH79mW+7bcIDXPrXv3s8rkEmPvvU5x50GMgQl//6D9YcEw/88A84A7G6oWduz9YQwu/4gYdclChtuv+zctwaQeKhI0SJXqPtOmnY2sARR02iykgQa0IXQqRqCQO1n/HeWRKaTRbtZzz6mJJw8+FC1nLoJmnNXTlnsjazbGYOsyREXTpHmxsLL79mpHa8/rKP7RXdi855kkd7/PVLWFtFf/nlC1gyQvaud7WX+NhIbkpH+MKvzdRWbnp8I7W08A17g28nb58Yzk11yLjj07y1UzY9sglRz/DNB6NrI8fHOrlRT2+330Ir51wfUV2I4YCLbdTRJwZQXZz/tJ2ofeR52EXq6sOp/Wohz6HgrDYqsp1m7ZPzAxul2uB42jpzbSPX+acs1sjbM/bRup4H3i1q7MKOLVjbZHz/jKsTkVFa1/Nb81F1ghGsZZyyf5iP1Hu3R+3i2fb8eauV454JWlbs2U69XTy9DbWMDh2oWzG+gba1vUNBtQIbJ7aKioEDRGquCdrV221342omjg+iNoHt21DNPGe30LLOU3eFW8dRm4jMo7oV2TCtaowOGfUfwdoE1rlYO7GrbYYw1c1x6yBqEVtB3cXt47SoIKf+Lt7WKg1VGB9d82Csw9rDYBnVDyZoUzFPI+8dRG2ygKx24ukbWPPGg0NroJHBNjGyJsgYapdhTLUDOlh7gGim41OLIjbC2uVTxUbeCLWKjCGsAS1rZDRTbQKuIdYu/4+1dgkNaVWx3AgjtgksowZARO0hDGtEmxoYzQwtQnOW26VAjVCbiHlkTXBtAoFmDjRPYLVxashk44ThiPVQXMYaIE4NSsmUQD5n1cxiDfLlg59jUv2y8POj0SuNhFSV9/AZ9wd95GXTOJ9ImZZHfvlpwVN/seWX80JelclnrPSVOA8P/PrbboWLr3/PW96EUigHTv74ZwZHE33xLX9wOgZ5VaJMMPY533lKeNebg7t+8Z3z84XDwUef/5CkygSdr9z/OfeaaGa29G1/+eunYpCrwLuCe3/wn95/4Q1/cgpcT+z/7M86wbJzhkXL+fxNRtUi/6LTP3YvhdHYIuNjn/sQsYLAqS98+klWnj47TM/DT72DwjlWD5EsZKoIf+dXjVA40eAYsyOf8/k7exKHv/QzjxCjU4wcv22sl9ChkKekCR4tsAqM6EcpnKfhIXB0L1gpIx47QiEnAF8wErFuRhTmKS/jsUtUKOUyk6P5nojJlwKjkKerIuZlqxnXZ6n20XmsF2nxPZjoj04sPYG6GLOLyFFWYvJqF6YuU6kpTAbUA7zmURl9U+EDdJVfehSjV/GqLuFZuEowX1yUVEoafKaMfjqP+dWuv2pOvZm7+PxVwsvf7WM1mGafTzm4ddr6C5dxKxxvebkP9B7db/sVS3+FUXXkzwZRqU3fMubUV2yAlbL47DmsAriwDij+8/0uga4dVbmtn26OvipWY9c780CV0X+Ng+JPSRmyL6a8RkU/ltnpYFT8XUPw3+9RmhePS2UuP471pz3fmoeK7NA28YxpSwFzn03pq3/Wn2DbXc6q4nbjcJEmzL90Peqm+DZifxoeCtV9wU72k4ap2Tspbag/jWiZys/cx24lmpn/n+FS/TeuMMZYqm7rFzJCYl987rFy1l/EMiDz+1muzh9hYypw20rFZWf9BPsIhjj8zRaqY5j16disMpMvU+wr136TgLFnd0HSsWRit+tmTP1Tf7HXvtMZMERM4WtxtNMN2XvPZbGPXP0xIoAj8UQN7h4sYTz58wp95DUXRQ2kXenCvjLI3nEui33jyo8rAsYESmHalAzTUBnT4989j/WJxd+8BCA2fzY+RU3Hy4DZlqD+4I7krLb7GcE1Li8HOKR+IGerGOs7UWlUh+GeCBdvNM6WKJtjNFwcVE888zeuXmvW3DN/c7GbkdF48Rmd3tB//dgNs8bY5Z+m/HAyq8NteQU4JqdlDSn4LOptF2oQN/sqgE1baWbs/JCX1WsyHTasSnw88RM7gmuEewGi/EIqrtYAdSrBEE11lBdFsht1wFXTZOshfWS+QT5rTO9KZEzVIq+o0+kTRp4o8kQthvtbemO6Fr4SkeeoIapZYKkWw5WA0VCr3TJxuQ4DFWVZQ2CgJyWag4U6dCoaHmlMB+shJJrEJlWDoYpQY0YpLxYTXcNmsVRiS0WuKWJTD2CJPkE9d/hqhoZQI+CQekn9crA6DFHteCfQSHFooF5vgViHTkVjWFP2+lrZTZiqw5iqyTA1AtvX6cUnCsSr6cREJUaHhiruHihnbEoTIX4yHYxUochwYxjqlKNzDKUojPghLN06VwE2uLkpmOWlxKYHcSnmluFhajiRVSA2bUUNQa4UjN0Wk9xYhiuWTLYxrwDGxumPYmw0KMVFYCEkg5FOBY7NO3ANEVYqMm5G9cajBrFIZ36gAti1I9JUC6Vgi0j6cIT5BSVDo73J2OmCa4apKMqNnMEleRKYfDExGRO9EVhPcxdLic2fZmkeA8K5W1Gy9RVAjjVmPpQxNu0KaZ4AuHk7qcWGShrsFmIZ2CQjpc2ssGxnVBq4z1cRmsNSD5tJGxZXmXkaLo14at6bY74xxnwZ0TmQaG5pBXMHvaXB9g/1BrExMF0G1n8mPoHperFKcfVgTIT/dPViYA2aKTd2e3AJ4NIqYuZLsTTi210vDZ8u510g6YfCCsgeyhLBvVv7iPWgIZIa7+0y/UxiKr7V9Q+IlDRbnwY+zOrhPWbJvjH2k7Ji7JvxSeyJ1cQ1kXzn57s+4koYW784pInXV4OZ695S8bNR/UJ01A3/GR0joenDi91mP+LSnbwP9aDGwLArMfED0SfhWV2M2TcTk2Xf4+gxNmi0zK69USngBXE1WHwnloxTu0zlmis2qNvwjyESmvvgo3QVj1HDLd9Hn4D1nW7jXxh8imh/MN0Nbix4S9b5rHKiaE7ckHfRaR9IKfsbys5+1KVjAz2G5jCYdRn+HlyK6J8zW8KYfAMxXdZLRA2RZa7LrffHJMH9NqUX3o2lUy+BBncZ+hWJhObmX1COi3XoUSwiU1O63nYmJnrJ9VLiiUu51QuuFY5mmhZXG/qNm46E5q79Jj1OfXQunZUznjh3pCHSvF+RP3330lIC05Mf/DgqY1z4h5HJmZmZGbMVBtIKrSIB+Xy5wFvukqkRGBHI/XcFbl4lFAMConIDN7uUG2ixWLi+7c9ZHQBWUDggkhQAAPBLAJ0BKqMAoAA+USKORKOiIROJrow4BQSygGihLO7vtD6TDGMXYRdmf1EbgXxZv0r7KHoAfrX1w/7b+wp+tfk3fBF+4n7Q/AB/Df6X/4s4g/gH0S+P39q8DfG39CzqcWfVxqWfLfwn/S/vvo33y/JHUL9tefG/R6QUCfqH+D/4Ph9apXiT2A/1f9Lf+J4w/ofsIfpD/g/eB9Lf+b5ZvrH/4e4V/NP6x/wP8J7XPs5/bn2Kv1nb7Q91WjyOISC9LXQaPgUEhZGLvb1gZ3fLb7Q+7WP6sCUCAlMZ6ZG4j9d8U628TsRFuX8Hltv9kId8JtxH9bpxcE1P9KMOw7ktg9zhEj8hPtEDh9kG+At2GYHwFeF75IFWrPHfzfmj/jR275rYW6g5x2+AA13IbMT8or+eWAw6fcsWgdDw6T3qxqNT0JHy/esUVxqpiunfLrPqI1wDcgG65whLtq0Ia1f2oMkD42TSYScz1ZBvaWehwffnXrC09FbJ0f/fv74PUJNUk/W/uAkL6OTZoOamJpKqqHkLmHgpEtGYsBBoGirWONkHjm2tuMMWZ5ImZgEH8FSTFCCFSr/H5o+FTba5suitpIZsZVbXimhUjKWFNyy2s2gxfYgBrCvB+IozlbSGSvHILOTSAdVvCAXkPKzkiPN03tGw1dF5rFW4SrLL7+vZPi27pW4rVbRlRbuPzwbYZ5wqL5qnEzq9tYXwE1VrX0J4tCdOiGGa1BmnZxmNnYV4OrGInTIqLXXcw/fFXZH9Ji+QNZ+OVDJsaWDSLMQ4u5ZLodzpBPafx3zhKcVzKHdovSgrAgA0WT3l8AAA/v7uqgnE8llcA5H7ebd0nn0N7TMzrS3sM3TnLzf+jDO+6orgtTJI5dR14mIR9ZMfmore8q5OmNjnH0jZW7x+MPuwJmeuGpF7rIZv4j3ZffHpJ4Tz3F15Nv+oDarusEp1wMsULGu6K2yi7Io7U+/RhLYQPXj00BNdY+Xr81u9aG21lY7mxam5PYrei3GVuKVRjjfa9t4QJDQAFjGNRHCHJvT3WTNfcB8sAwSDg76vBEfmKQcBdq156WLX8hdO4N2V72g1vAfJuqgHOL66OOGHtjjaOfVT9anlh79GjijLzLLE1eCb5qB6r1O02ozLkVdWP7qk7AwY8tZS2g+nszElPzekN/gADLWmVRLjcHJ50boLVu1nwv2hh8JpdHMGqfVSGPDOlrrFhPbA600iAfMSDusC1X/Hb+I9E90hPv3v+lh9MIRsDtfH0IUCP/mnWjAKtrM6OTBk8JMCDHrz/mE8CYJdE9EdjDF8oQsaxYxD6/ILbKpVESa53I5qkNSv8iHFVnbYkr0fBAWwqFCUqAzpIAKUVPUhDP9vZk75EWdYkZxiyLWfFnTRbW1zlyMO2/eKpkkQpVdwOfdzbN9P6TAFZQt85ll4nictgvBZAnVDM0Wjjmul0n+lpIZnUuasvMYGarnG5qVfuCXTRlU7TpHwkC4PYYnMCvmxQMhq2qehVMGgGRuT1L0FQBO4lLxoKKiGX/+H//I1HOb6SZY4Q6wnc3kHJgHLN5T7UZ9xwImyPmbhULQBRkDmkdQBNVZXU5iVzHsz2DX3PEvFz9mnBKQhZFBaxOjQV/OlWdpXOfuACwQ84HybOPz77nvTP0PILj/CxDTZs69Kpnk8aOJT7+0Qq+R/odiCT3MspgBXyqfaPnDvgudYNbNX7j/gs2incRAE493QZZNDdXW5wfhvt80Rv4GwPYQ7fFuc8+yJ3igjtS8mweVvXuZFZF5Vp845SfTnWwjO0nGx6u2TyqUHPlMe0XSa5vDp6uWXsVPjj94l/IKTuPh3JkXOH43/GOZcFjXDhbshd+lxlxVHMRXsYSrw/y4ka7Pxw00hMvEwQWC2zDhC+zUVYdbHTmA7fvSfb0DesfmHIw479sHaSiTygp1OaYm/iKu0rZNZf4guyXECh8IauOx6aQABXnLqOIvz7s+6w6RbQNl5yEXMh4uVxLwQ9AW1LtQ4viRUmjMNFcr2sXoFmRH//xnuNnWS2XfLP54OtILr/B8r5boW1Mrx6xp1mOdKtIQZxL31iN4bTvvfcV0JrpHPgNzByuiYjBnzdiE9zKDH8PxA1OXv5EUwF3QPg8zcbl0wnL7SrsdVdjrVTBW8HwHM+lc5AseFhvdxHCyUeMyl+EsHkzVYd8H0zTRWF9Haqu/Aw5bzSsH7OObyT1q2dGxzUjkq+O2x+HufO8xiQBExW5ZHO4iZjyKmimnESyt4CVfOKa/DWMB7v1/bNxFDZgfyKZoWlIEhZVIYVbqAi4OFxRassuBc/kGNKzj20llKl25gUd/O/unjfrYBzmkJ3q4fw4jp9V+U4PXJLjBp3iGk69x+VdT45+6cj4ciMYEweqShjppLdq8/hJJ9iRFbWqU1HTebW7P1v7zzQfDChroAKJdXZ7PX5zEHzXsnuVwghPeBtCdOrgVNJXdM0NUFpSoNjKbQgAQSiM9/aDWwj1Rnz8RA0mdQGBWO0/MgriZ1bMTjktjoXTMDXu07xH8JQXZSe/JsRoDaA4Uvxe1qkzuG88YNly6xada0V/MuqMHv5tSyDZ0Uvi+Uk9JQUpU55rcsZG6GRfXW6idkV5Gfyk1Pn2Hkxq73P9MBJo5FEteXjZ/mmMi/g/g8Fpeha+k/a202sogZh6P0TAGpKR2+Ts1ENby21WXeNSL9N/x90zd9WVRojizGnjI8YByG4r2EpA5exrke+D5aBO++r2vrF4in20athGaK1CyX6bKUljmSTcFsIHkVrToMHf8cQXEBhDtsMEKCKqfAfaSXTH7aElZ16n8QvzipzoC7IFURAacBxHX+JsLPWS6IHS7AZVybTsIDfPmpyEo67BvFDEM2qX/2vRWIZhyL/eCHMF3kaVJ3rNVHX5QadNODyENXrzUQZKN1/CBaRbHmqCpV7JKQbDCdSDf8e/8+iavBZ1J/bK/OTT5/KdBOuNsstz31r20SBa7kjrGVmaB0pqWKDmeGcw9j17TaKJQpolhdnYfVHePp5m0/NDZ4fPQmsq/eXQJncnOamjz/AOfKnM0NQRjpbdGPjzmDUsmXy1sVKB2NAXZJoWI91TFMD0h7FI6g9To9DFpgfwuQJpizzUVzbdUyv/+gMTOTbsIvM5Y0JpU3yTekxv0TkDvi5gGEDoOqJdKy7mJiThuZ7uN/QXzakIDO8mJlG0rhFkjQy5KaoneR+9Wjoo7Ll2shx6OBizPNemeLmLxPQ4Px952mb/fvhc80g2N+xeuF8WeiH50314wtG2XXru+K35S2kAf06wSj/Le7hO9QIKE+yI/JUWVajl53hG1pVUVRN6h8KfCXlNleSbpsyR+HshEA/lEomxBE62hnvaenN/j6uqwtyM5YdKOL0es27Q7ojsvqIroUkppxxRihHYlhSrD0VFB3QHwFWRQdq0VrQUyrqg8RAl1ZIlryKPVaWi02JdmECbfFF5ybzvSV4ZFCbVil66gZ4+fEz1n5k+UEk+lX4uJlsnx85m5y7OlZVdofI04pmIvcm/bkAdJKBHr9e0btiPMHtqRQKoSc03TNSluptKKN2oH7s4xCImZQdyUNLS5Pac2td9rAbnq+K0uoFh843UQx1dEKQx8G2ppj9jQ4F1IcBFzEh5nK11TJAVEWfhdzRISxBlAYjk5TMAQLPszBTTV6mOgMEaGwWStkG1Iyt2e67KVhOPQBSc8+4Y9rO1OSukAOtCkcQ5w2kKt86s9lbAiRcGfEE0iubHMsTkkdCEIX9LnXwOE2I/xR4em223RdDqGlxyMCdsgCvLMgd3B/4XZ9oKV0EqQxMpMVNotgZTyyhLHYZQzqz/2vAklbV2iQeBcrXY8bQZ3zi0ZFeAe6+mdhi27L/5qa+r1r4tiMe+Nyev1dqHmVWXFcC6RU2/D4xNCwvPnq790O+i+AiTLBlndHzuT/kWlaO9QSXNLPxLwQECs5bqP1P6eptat0j/x1rhqIfzLB0BYdzcJRNCcIRuA2OV5fKcxM/+cAh3rs4q7saVOKcs6utneBSpo8STABHOdmquq4+cxd6MlFIK44W2fQE+XnxaV/3DGroh8MvG4WRHY6P2o8Bl6VxpblgtVzqPpjL/InHOPUOcm0tIXCwZi5xlKjJUXv4ahzoC+sTrAge901Llyq2wkYJnBpxf7KknQ4aIE6xdESaWWNw87DXMIwVDeX6Cy8prI08k4hDM4/RiS7bboZrnzc67anRr1bcn1Rncrb9+nkHZZNLPErcpSScRpy9gDonSpRj1kLBIWuO0KRt1o+HIrP5vK+s+ISmYHXl50Z9dYRcpuE1SFjRvP075D3riFjeDvurTUwxosdEY115Mhf/lINSeNJpgl5oJqUUWEGdVoypdNT46VUx14j7YyLog/jbjxd7vkMJ9+JKYaDAN91MkB6+y4iLKLs9CNxaFyoctJgUk3rhvKvuyHn/cXYWkrG6egLK6z2LEBCvV3ftpW/OSSBjQ4t1kL/Gxo7cBgtuEBkBZ4PAP+GEB7OHcjSIv4ybszexYPLk+GcOXYauJRkAnRpW6koUDlTC3iLPcE2O0zeMv7OP77vtJDwbo33Lnzr8XFwYhZjNJHHFs1+6fRdUVeePKdZa8/3FA0UDL77hLG74lDIVxbfO/jRCCgTj+l+bEFK7KUpdZKDjC63JNvdGcR4hanjo84wLesiYoziG0PBce0p+hlRbQvk22dQ79s26YPTQD6eQ5743I2GlFnJdywZVqgC9FOUbntKQXYwd1FzpysVUZHliQWAPtYeUJ+pxe9id7zRt4POYuPhSSk4sgWaAQCgVGJkFyhs3PHR5QKpEmntASqRaXXd2iwLrRTCyM6L5FgnJzO+2mqLWUdHirA69cN0FrRzMai9D6454R20sIEf5Xvf68IelHo7Gp7FB532rapNnF6+nKSNJPlRtaZtE6x+asU9ZtMY+GRWVFBj5vdW9O2HtxRjpWbtGo1p2Tv+AhHK5qox9AwlT8ip8nOy+GVKowmPYN1s/74e3bG/uYReIhlzwfIxd1oj8Kv8TNLqhXBpcZ2syd6K7EJpxOLfGp35Ngp8QkWu54i8sLBrCj3DUSYZ4qvWi1f+U/JnYAJ7JTFUwLV3h3tEJeuxtnW6dIXgOdZSL5cSQmLcyLWP6EU49biSoxk4PvSysBIrl31HRiZ0zHVQ3yw+avjmIzpcOAJwsFwnLjRlzHfmPIvnGW57aunK+PAPiZRr+JJvpbc3xuv5amzBWpGgMAGgPz+zqbPKmqxYkRczNvRVoe7w3MzcG2jSt7/6JD+z2SiTWPzCvjGbanYY/GfNjzNyy1tnMpdcx/2VvauiLh8/Fky4DdZLhmeYMBFc7FKioRHJmSTqvMnDFTv07LRDzfLyw68LIXDLoD4lFw7x+k1DA+qftkEmxOOaxgmxNxHu9BHYp5epaQsDJYM3O3DBEzRrDNuNdsXRm+17Zu/tQc1DYwP3eQ/lfDJ54ZLWSeqdj86CjWw0kmyjvZq75fARcqKWzS5CFdk5dORVPfsnfIVoZ+yTgehSamtbLMLrlG6megxJcZozZSiwpP80D8LoeMQ9HycI6ZOEROiFMzjjoUiYX5Y2WyFqbUlmp6EhTWB22jz3bVVuMyU13HxXSmDFhMlSHMEayZ/5m8juEqi/9+0V30W0PkFehtUpr/1Hw+gd/1uS+Io1c6Fn9FWS9/pHFldJMOclabu8DYmYzZ+IZoRxT0wbfVWZ7jXnO4yxCgHeHzbu61uY4kdLVexl5pIkRmm7Yem7TpcQhYo5+VyNgghfwJpnfGY7MTLqJorn2Qtje8HVJKEDW+ixCilQyeg308eN4HhIhhNW204ABYZxEm2qoCaKzZ+/BH/ga7HRb3cRItJGke0h1tfbVdetZ6i6y+KjrYmu7k5lKJJ9q00BAWa3eniMN5dLodQsA436+UP6Q7RMR7pQvTyJsiVfxcMOTZwUPtgyAAtMPRewVz7BFKTUS0qDJd5tIV/p6Xq7kLn+UzFFPXSl2GEhjO/5hBnWxNo6RzxMDQ+CmEZUd3jq40gE/thafPU9g791rTrM96AJ9xKobaNbAbqHmd2+wYC/4RYHwW8xkjb7N8PIdJL/N/1QMc8SEbI5AB+xaQhpehToWjNWXcZ0JyISe3TK8Ob+Y25FOjTRYc903jlQQSJlamsnfaLL6iJkvam6IW7C5hfiKJ6l4W87qpOj2QgAfQkc2aXiytl9rIRBN1FIkKFCsL0kD3CcL7uJv8hfmBZX6eMsdTZrWzrt/3GrOnc9x9Dmn/AhT/N9c/qRJFcX4NJRJpVz6zoKdlVbXGJIhxSy4ZklVm+TWWlnqkd5O4wRgOWriGuccLThYu+V/lPg6eEoJU31bBL4pK4+/DOCmjQYEl/8M7RztVmwOm5/xHUfio/lOs/kxYyTR9giYh7SXNW6VZOl0ssDQh0rX01wuguOfOJb2iR5EGjzSKzVFIfDgxGshOWXiHuYl5J+A/Qm11rEtccuUrhBkHZ0QllZ/lIhp01k42ixfx5tFSFgAywbkuAaoSu1xmVvX3hC801TSJ1HpS2KaUZzf+S/fxvRiqlA1VY5AuIiU+KE5EooHe9+DHny/lQonslSvejgDlJVyZTP20VYvmUkV2DuxgC0JWh/wIQbJDefyKkpzc1mZm7l2Hy8u8tY2EbSXvatijHRG0O4JKrEXTPMy0rJn5IBfYO4wS+TmcPVBthfLQS79Lkv14kUD5MvMZmjWVl43wTBCxKLam735aEYaLCCG5sd0xb0OHwguiUpLImcwUS7KlbMTx3WPWfrvhIxD2zwFHhD7k81Jv4U9EVGyPwW8rtbkHEHTq+HNbeKPd1tNrLt7t3Fsorw1Hv345csraQfPEerdcP7JiRhcVKNZF2FGZ5ignjOG+fh+ctbPiMOfSHMGiYHahFpn0T+XgvVVjZY3+MrOLpMdK2ofunnGy5Uf+HklpsM2VYsAKUdJiSvOHP6taTdgRbZVBCWYPFKAz04B8Kgf/+/fMvoNV6FZP49s12SDMmn/e3Dnmv6UDIB0xcAAAA=" alt="" style="height:80px;width:auto;margin-right:8px;flex-shrink:0;"><span class="vs-logo-text"><span class="vs-lv">VEGAS</span><span class="vs-ls">SIDEKICK</span></span></a>
  <ul class="nav-links">
    <li><a href="/shows/comedy/">Comedy</a></li>
    <li><a href="/shows/magic/">Magic</a></li>
    <li><a href="/shows/cirque/">Cirque</a></li>
    <li><a href="/shows/music/">Music</a></li>
    <li><a href="/shows/family/">Family</a></li>
    <li class="nav-more">
      <button class="nav-more-btn" aria-haspopup="true">MORE &#9660;</button>
      <div class="nav-more-menu">
        <a href="/shows/spectaculars/">Spectaculars</a>
        <a href="/shows/adult/">Adult Shows</a>
      </div>
    </li>
    <li><a href="/news/">Dispatch</a></li>
    <li><a href="/shows/" class="nav-cta">All Shows →</a></li>
  </ul>
  <div class="nav-mobile-right">
    <a class="nav-mobile-tickets" href="/shows/">🎟 All Shows</a>
    <button class="nav-mobile-menu" onclick="vsToggleMenu()" aria-label="Menu">☰</button>
  </div>
</nav>
<div class="nav-mobile-drawer" id="vsMobileDrawer">
  <a href="/shows/comedy/">Comedy</a>
  <a href="/shows/magic/">Magic</a>
  <a href="/shows/cirque/">Cirque &amp; Acrobatic</a>
  <a href="/shows/music/">Music &amp; Variety</a>
  <a href="/shows/spectaculars/">Spectaculars</a>
  <a href="/shows/family/">Family Shows</a>
  <a href="/shows/adult/">Adult Shows</a>
  <a href="/news/" class="mobile-drawer-dispatch">Vegas Dispatch</a>
  <a href="/shows/" class="mobile-drawer-cta">All Shows →</a>
</div>
<div class="nav-overlay" id="vsNavOverlay" onclick="vsToggleMenu()"></div>
<div id="vs-memorial-banner" role="banner" aria-live="polite"></div>`;

  const styles = `
<style>
#vs-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 10px 40px; background: rgba(10,22,40,0.95); backdrop-filter: blur(12px); }
#vs-nav::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #FF6B2B 0%, #1A6BFF 100%); }
.nav-logo { display: flex !important; align-items: center; } .vs-logo-text { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 2.1rem; letter-spacing: .03em; text-transform: uppercase; line-height: 1; white-space: nowrap; } .vs-lv { color: #1A6BFF; } .vs-ls { color: #FF6B2B; }
.nav-links { display: flex; gap: 28px; list-style: none; align-items: center; }
.nav-links a { color: #D4DCE8; text-decoration: none; font-weight: 600; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; transition: color 0.2s; font-family: 'Barlow', sans-serif; }
.nav-links a:hover { color: #FF6B2B; }
.nav-cta { background: #FF6B2B !important; color: #0A1628 !important; padding: 8px 20px; border-radius: 4px; }
.nav-mobile-right { display: none; align-items: center; gap: 8px; }
.nav-mobile-tickets { display: inline-block; background: #FF6B2B; color: #0A1628 !important; font-family: 'Barlow Condensed', 'Barlow', sans-serif; font-weight: 800; font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; padding: 6px 12px; border-radius: 4px; white-space: nowrap; transition: background 0.2s; }
.nav-mobile-tickets:hover { background: #e85e22; }
.nav-mobile-menu { display: none; background: none; border: none; color: #D4DCE8; font-size: 1.6rem; cursor: pointer; padding: 4px 8px; }
.nav-mobile-drawer { display: none; position: fixed; top: 0; right: -280px; width: 280px; height: 100vh; background: #0D1F3C; z-index: 300; flex-direction: column; padding: 80px 32px 32px; gap: 8px; transition: right 0.3s ease; border-left: 1px solid rgba(26,127,232,0.2); overflow-y: auto; }
.nav-mobile-drawer.open { right: 0; }
.nav-mobile-drawer a { color: #D4DCE8; text-decoration: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 1rem; letter-spacing: 1px; text-transform: uppercase; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.14); transition: color 0.2s; }
.nav-mobile-drawer a:hover { color: #FF6B2B; }
.mobile-drawer-dispatch { border-left: 3px solid #FF6B2B !important; padding-left: 12px !important; color: #FF8C2A !important; margin-top: 4px; }
.mobile-drawer-dispatch:hover { color: #FFB347 !important; }
.mobile-drawer-cta { background: #FF6B2B !important; color: #0A1628 !important; text-align: center; border-radius: 6px; padding: 14px !important; border-bottom: none !important; margin-top: 8px; }
.nav-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 250; }
.nav-overlay.visible { display: block; }
@media (max-width: 900px) {
  #vs-nav { padding: 8px 20px; }
  .nav-logo img { height: 54px !important; } .vs-logo-text { font-size: 1.5rem; }
  .nav-links { display: none; }
  .nav-mobile-right { display: flex; }
  .nav-mobile-menu { display: block; }
  .nav-mobile-drawer { display: flex; }
}
#vs-memorial-banner { display: none; position: fixed; top: 84px; left: 0; right: 0; z-index: 199; background: linear-gradient(90deg, #B22234 0%, #3C3B6E 50%, #B22234 100%); color: #fff; text-align: center; padding: 7px 16px; font-family: 'Barlow Condensed', 'Barlow', sans-serif; font-weight: 700; font-size: 0.9rem; letter-spacing: 1.2px; text-transform: uppercase; border-bottom: 2px solid #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#vs-memorial-banner.vsm-visible { display: block; }
#vs-memorial-banner .vsm-stars { color: #FFD700; margin: 0 6px; letter-spacing: 3px; }
#vs-memorial-banner .vsm-unit { display: inline-block; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.25); padding: 1px 5px; border-radius: 3px; font-variant-numeric: tabular-nums; margin: 0 1px; min-width: 2.2ch; text-align: center; }
#vs-memorial-banner .vsm-link { color: #FFD700; text-decoration: none; font-weight: 800; border-bottom: 1px solid rgba(255,215,0,0.5); transition: color 0.2s, border-color 0.2s; }
#vs-memorial-banner .vsm-link:hover { color: #fff; border-color: rgba(255,255,255,0.6); }
#vs-memorial-banner .vsm-enjoy { font-size: 1rem; letter-spacing: 1.5px; }
@media (max-width: 900px) { #vs-memorial-banner { top: 60px; font-size: 0.75rem; padding: 6px 10px; letter-spacing: 0.8px; white-space: normal; text-align: center; line-height: 1.4; } }
@media (max-width: 480px) { #vs-memorial-banner { font-size: 0.7rem; padding: 5px 8px; } #vs-memorial-banner .vsm-stars { margin: 0 3px; } }
.nav-more { position: relative; }
.nav-more-btn { background: none; border: none; color: #D4DCE8; font-weight: 600; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; font-family: 'Barlow', sans-serif; padding: 0; transition: color 0.2s; line-height: inherit; }
.nav-more:hover .nav-more-btn { color: #FF6B2B; }
.nav-more-menu { visibility: hidden; opacity: 0; position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #0D1F3C; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.45); min-width: 172px; z-index: 300; transition: opacity 0.15s, visibility 0.15s; }
.nav-more:hover .nav-more-menu { visibility: visible; opacity: 1; }
.nav-more-menu a { display: block; padding: 11px 18px; color: #D4DCE8; text-decoration: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 0.82rem; letter-spacing: 1px; text-transform: uppercase; transition: color 0.2s, background 0.2s; border-bottom: 1px solid rgba(255,255,255,0.07); }
.nav-more-menu a:last-child { border-bottom: none; }
.nav-more-menu a:hover { color: #FF6B2B; background: rgba(255,107,43,0.07); }
</style>`;

  const target = document.getElementById('vs-header');
  if (target) {
    target.innerHTML = styles + html;
  }
  // Orb particles — large slow-drifting orbs behind logo (speed 0.3 = 40% slower than sample)
  (function() {
    var canvas = document.getElementById('vs-logo-orbs');
    if (!canvas) return;
    var nav = document.getElementById('vs-nav');
    function resize() {
      canvas.width  = nav.offsetWidth  || 1200;
      canvas.height = nav.offsetHeight || 84;
    }
    resize();
    var cols = ['#1A6BFF','#FF6B2B','#3B7FFF','#FF8040'];
    var orbs = [];
    for (var i = 0; i < 4; i++) {
      var xMax = (canvas.width || 1200) * 0.34;
      orbs.push({
        x: Math.random() * xMax, y: Math.random() * canvas.height,
        r: 18 + Math.random() * 10,
        color: cols[i % cols.length],
        vx: (Math.random() - 0.5) * 0.21,
        vy: -0.15 - Math.random() * 0.21,
        op: 0.13 + Math.random() * 0.12,
        xMax: xMax
      });
    }
    var ctx = canvas.getContext('2d');
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < orbs.length; i++) {
        var o = orbs[i];
        var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save(); ctx.globalAlpha = o.op; ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        o.x += o.vx; o.y += o.vy;
        if (o.y < -o.r * 2) { o.y = canvas.height + o.r; o.x = Math.random() * o.xMax; }
        if (o.x < 0) o.x = o.xMax;
        if (o.x > o.xMax) o.x = 0;
      }
      requestAnimationFrame(frame);
    }
    frame();
  })();


  window.vsToggleMenu = function() {
    const drawer = document.getElementById('vsMobileDrawer');
    const overlay = document.getElementById('vsNavOverlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('visible');
  };

  // July 4th Weekend Countdown (PDT = UTC-7)
  // Counts down to midnight PDT Friday July 3 2026 (= 2026-07-03T07:00:00Z)
  // Switches to "Happy 4th" message through end of July 4 (2026-07-05T07:00:00Z)
  (function() {
    var banner = document.getElementById('vs-memorial-banner');
    if (!banner) return;
    var TARGET = new Date('2026-07-03T07:00:00Z'); // midnight PDT Fri Jul 3 — weekend starts
    var EXPIRE = new Date('2026-07-05T07:00:00Z'); // midnight PDT end of Jul 4
    var offsetApplied = false;

    function applyBodyOffset() {
      if (offsetApplied) return;
      offsetApplied = true;
      requestAnimationFrame(function() {
        var bh = banner.offsetHeight;
        if (bh > 0) {
          var orig = parseFloat(window.getComputedStyle(document.body).paddingTop) || 0;
          document.body.setAttribute('data-vsm-orig-pt', orig);
          document.body.style.setProperty('padding-top', (orig + bh) + 'px', 'important');
        }
      });
    }
    function removeBodyOffset() {
      if (!offsetApplied) return;
      var orig = document.body.getAttribute('data-vsm-orig-pt');
      document.body.style.setProperty('padding-top', (orig || '0') + 'px', 'important');
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function isMobile() { return window.innerWidth < 480; }

    function tick() {
      var now = new Date();
      if (now >= EXPIRE) {
        banner.classList.remove('vsm-visible');
        removeBodyOffset();
        clearInterval(vsMemTimer);
        return;
      }
      if (!banner.classList.contains('vsm-visible')) {
        banner.classList.add('vsm-visible');
        applyBodyOffset();
      }
      if (now >= TARGET) {
        banner.innerHTML = '<span class="vsm-stars">★ ★ ★</span><span class="vsm-enjoy">Happy 4th of July 2026! 🎆🇺🇸 Enjoy the fireworks — and the shows.</span><span class="vsm-stars">★ ★ ★</span>';
        clearInterval(vsMemTimer);
        return;
      }
      var diff = TARGET - now;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      if (isMobile()) {
        banner.innerHTML =
          '🎆 July 4th Weekend in ' +
          '<span class="vsm-unit">' + d + 'd</span> ' +
          '<span class="vsm-unit">' + pad(h) + 'h</span> ' +
          '<span class="vsm-unit">' + pad(m) + 'm</span> ' +
          '<span class="vsm-unit">' + pad(s) + 's</span>' +
          ' &mdash; <a class="vsm-link" href="/shows/">All Shows &#8594;</a>';
      } else {
        banner.innerHTML =
          '<span class="vsm-stars">★</span>' +
          '🎆 July 4th Weekend kicks off in ' +
          '<span class="vsm-unit">' + d + 'd</span> ' +
          '<span class="vsm-unit">' + pad(h) + 'h</span> ' +
          '<span class="vsm-unit">' + pad(m) + 'm</span> ' +
          '<span class="vsm-unit">' + pad(s) + 's</span>' +
          ' &mdash; <a class="vsm-link" href="/shows/">Plan Your Vegas Night &#8594;</a>' +
          '<span class="vsm-stars">★</span>';
      }
    }
    tick();
    var vsMemTimer = setInterval(tick, 1000);
  })();

  // Google Analytics — injected once via header, covers every page
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-BM6QGF7B4Y';
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-BM6QGF7B4Y');

})();
