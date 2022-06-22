<script>
export let bindings;
import {Content,FileUploader} from 'carbon-components-svelte';


let {Car,color,greet,parse} = bindings; // destructure for easier access
console.log(parse("A,b,c;5;6.3;7.8"));

let files = [];
let content = "";

let reader = new FileReader();

reader.addEventListener("load",()=>{
  content = reader.result;
  let res = parse(reader.result);
  console.log(res);
},false);

let add_handler = (e)=>{
  reader.readAsText(e.detail[0]);
}

console.log(Car,color);

let c = Car.new();

c.number = 5;
c.color  = 775577;
console.log(c);

let c2 = color(c,557755);

console.log(c2.number,c2.color);

let c3 = c2.duplicate();

console.log(c3.number,c3.color);

console.log(c2,c3);

c3.change_number(7);
console.log(c3.number);

console.log(c3.get_id());

//greet();
</script>

<Content>

<h1>
    Connecting Rust to Svelte Through WASM !
</h1>

<br />

<div>
  <FileUploader
      labelTitle="Upload file"
      buttonLabel="Add file"
      labelDescription="Only txt files are accepted."
      accept={[".txt"]}
      bind:files
      status="complete"
      on:add={add_handler}
    />
</div>

<br />

<h3>
  File Contents Are :<br/>
  {content}
</h3>

</Content>