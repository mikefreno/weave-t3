class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    output.forEach((channel, chIndex) => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = input[chIndex][i];
      }
    });

    this.port.postMessage(input[0]);

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
