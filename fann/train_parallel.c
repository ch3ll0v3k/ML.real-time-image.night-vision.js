// gcc -O3 -lfann -lm train_parallel.c -o train_parallel

#include <fann.h>
#include <parallel_fann.h>

int main(int argc, const char* argv[]){

  unsigned int num_threads = 4;
  struct fann_train_data *data;
  struct fann *ann;

  // const unsigned int num_input = 256;
  // const unsigned int num_output = 256;
  // const unsigned int num_neurons_hidden = 256;
  const unsigned int num_layers = 2;
  const float desired_error = (const float) 0.00005;
  const unsigned int max_epochs = 10;
  const unsigned int epochs_between_reports = 1;
  unsigned int decimal_point;

  float error;
  unsigned int i;

  if(argc == 2)
    num_threads = atoi(argv[1]);

  printf(" Reading dataset ...\n");
  data = fann_read_train_from_file("./dataset/fann.test.dataset");

  printf(" Creating network ...\n");
  ann = fann_create_standard(num_layers, fann_num_input_train_data(data), fann_num_input_train_data(data), fann_num_output_train_data(data));
  // ann = fann_create_standard(num_layers, num_input, num_neurons_hidden, num_output);

  fann_set_activation_function_hidden(ann, FANN_SIGMOID_SYMMETRIC);

  // fann_set_activation_function_output(ann, FANN_SIGMOID_SYMMETRIC);
  fann_set_activation_function_output(ann, FANN_SIGMOID);

  for(i = 1; i <= max_epochs; i++){
    error = num_threads > 1 ? fann_train_epoch_irpropm_parallel(ann, data, num_threads) : fann_train_epoch(ann, data);
    printf(" Epochs     %8d. Current error: %.10f\n", i, error);
  }

  printf("Saving network.\n");
  fann_save(ann, "./fann.test.net");
  decimal_point = fann_save_to_fixed(ann, "./fann.test.fixed.net");
  fann_save_train_to_fixed(data, "./fann.test.fixed.data", decimal_point);

  printf(" Cleaning up ...\n");
  fann_destroy(ann);
  fann_destroy_train(data);

  return 0;
}