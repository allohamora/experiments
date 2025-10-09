import {
  AutoProcessor,
  AutoModelForImageTextToText,
  PreTrainedTokenizer,
  TextStreamer,
} from '@huggingface/transformers';

const model_id = 'onnx-community/gemma-3n-E2B-it-ONNX';
const processor = await AutoProcessor.from_pretrained(model_id);
const model = await AutoModelForImageTextToText.from_pretrained(model_id, {
  dtype: {
    embed_tokens: 'q8',
    audio_encoder: 'q8',
    vision_encoder: 'fp16',
    decoder_model_merged: 'q4',
  },
  device: 'cpu',
  progress_callback: console.log,
});

const prompt = processor.apply_chat_template(
  [
    {
      role: 'user',
      content: 'Hi, how are you?',
    },
  ],
  {
    add_generation_prompt: true,
  },
);

const inputs = await processor(prompt);

await model.generate({
  ...inputs,
  max_new_tokens: 512,
  do_sample: false,
  streamer: new TextStreamer(processor.tokenizer as PreTrainedTokenizer, {
    skip_prompt: true,
    skip_special_tokens: false,
    // default is console.log, but with better formatting
    // callback_function: console.log,
  }),
});
