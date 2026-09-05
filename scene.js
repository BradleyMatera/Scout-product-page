// Self-contained Scout diagram controller. No external graphics dependency.
const host=document.querySelector('[data-scout-visual]');
const controls=document.querySelector('[data-scene-controls]');
const caption=document.querySelector('[data-scene-caption]');
const descriptions=[
 'Flow: a question moves through evidence, context, generation, and validation before Scout replies.',
 'Retrieve: the funnel gathers local BM25 and contextual RRF evidence.',
 'Context: the layered core combines server session state and the response contract.',
 'Generate: the crystal represents a bounded Cloudflare Workers AI response.',
 'Validate: the shield and check mark represent deterministic grounding and provenance checks.'
];
function setStage(value){
 document.querySelectorAll('.diagram-stage').forEach(node=>node.dataset.active=value===0||Number(node.dataset.stage)===value?'true':'false');
 document.querySelectorAll('[data-scene-stage]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.sceneStage)===value)));
 if(caption)caption.textContent=descriptions[value];
}
if(host){
 document.documentElement.dataset.scoutGraphics='ready';
 controls?.removeAttribute('hidden');
 controls?.querySelectorAll('[data-scene-stage]').forEach(button=>button.addEventListener('click',()=>setStage(Number(button.dataset.sceneStage))));
 setStage(0);
}