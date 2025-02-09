
import kaisagif from '../images/kaisa_final.gif'
import { LinearProgress,Typography } from '@mui/material'
export const Loader=()=>{
    
            return(
                    <div className='loaderdiv' style={{zIndex:100,alignContent:'center',
                            display:'flex-center',width:500,alignItems:'center',position:'relative',
                            marginLeft:'',textAlign:'center',marginTop:100}} >
                        <img alt='kaisaloader'
                        src={kaisagif}
                        height='150'
                        margin-left='40%'
                        width='180'
                        fit='cover'
                        bgColor='inherit'                        
                        />
                        <div className='linearprogress' style={{width:500}}>
                    <LinearProgress color='secondary'/>
                    <Typography    variant="button" display="block" color='common.white' fontSize={24} gutterBottom>
                        ..Fetching Data from the Void..
                    </Typography>
                    
                    </div>
                    </div>
            )

            }
