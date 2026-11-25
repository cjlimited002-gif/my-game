import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { world } from './state'

// Lightweight roaming street animals: goats, chickens and cats.
// Positions are kept near the player so they remain visible without heavy rendering.
const TYPES = [
  { kind:'goat', count:7, scale:1, color:'#8a6a4d' },
  { kind:'chicken', count:14, scale:0.38, color:'#c9a76b' },
  { kind:'cat', count:5, scale:0.48, color:'#8c8982' },
]
function Animal({animal}) {
  const root=useRef()
  const legs=useRef([])
  useFrame((_,dt)=>{
    const a=animal
    a.timer-=dt
    if(a.timer<=0){a.angle+= (Math.random()-0.5)*2.4;a.timer=1.5+Math.random()*4}
    const speed=a.kind==='chicken'?0.8:a.kind==='cat'?0.65:0.45
    a.x+=Math.sin(a.angle)*speed*dt
    a.z+=Math.cos(a.angle)*speed*dt
    const focus=world.focus
    if(Math.hypot(a.x-focus.x,a.z-focus.z)>45){a.x=focus.x+(Math.random()-0.5)*30;a.z=focus.z+(Math.random()-0.5)*30}
    if(root.current){root.current.position.set(a.x,0,a.z);root.current.rotation.y=a.angle}
    legs.current.forEach((l,i)=>{if(l)l.rotation.x=Math.sin(a.phase+i*Math.PI)*0.3})
    a.phase+=dt*5
  })
  const s=animal.scale
  return <group ref={root}>
    <mesh position={[0,s*0.55,0]} castShadow><sphereGeometry args={[s*0.55,8,6]}/><meshStandardMaterial color={animal.color}/></mesh>
    <mesh position={[0,s*0.78,s*0.48]}><sphereGeometry args={[s*0.34,8,6]}/><meshStandardMaterial color={animal.color}/></mesh>
    {animal.kind==='goat'&&<><mesh position={[s*0.2,s*1.15,s*0.55]} rotation={[0,0,-0.3]}><coneGeometry args={[s*0.08,s*0.35,5]}/><meshStandardMaterial color="#d8c9a4"/></mesh><mesh position={[-s*0.2,s*1.15,s*0.55]} rotation={[0,0,0.3]}><coneGeometry args={[s*0.08,s*0.35,5]}/><meshStandardMaterial color="#d8c9a4"/></mesh></>}
    {animal.kind==='chicken'&&<mesh position={[0,s*1.05,s*0.5]}><coneGeometry args={[s*0.14,s*0.2,5]}/><meshStandardMaterial color="#d84b36"/></mesh>}
    {[-1,1].map(x=>[-1,1].map(z=><mesh key={x+':'+z} ref={el=>legs.current.push(el)} position={[x*s*0.28,s*0.18,z*s*0.25]}><boxGeometry args={[s*0.12,s*0.35,s*0.12]}/><meshStandardMaterial color="#51463b"/></mesh>))}
  </group>
}
export default function StreetAnimals(){
 const animals=useMemo(()=>{const list=[];TYPES.forEach(t=>{for(let i=0;i<t.count;i++)list.push({kind:t.kind,scale:t.scale,color:t.color,x:world.focus.x+(Math.random()-0.5)*35,z:world.focus.z+(Math.random()-0.5)*35,angle:Math.random()*Math.PI*2,timer:Math.random()*4,phase:Math.random()*6})});return list},[])
 return <group>{animals.map((a,i)=><Animal key={i} animal={a}/>)}</group>
}