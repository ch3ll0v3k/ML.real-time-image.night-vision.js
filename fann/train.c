// gcc -O3 -lfann -lm train.c -o train

#include <stdio.h>

#include <fann.h>

int FANN_API test_callback(struct fann *ann, struct fann_train_data *train, unsigned int max_epochs, unsigned int epochs_between_reports, float desired_error, unsigned int epochs){
  printf("Epochs     %8d. MSE: %.5f. Desired-MSE: %.5f\n", epochs, fann_get_MSE(ann), desired_error);
  return 0;
}

int main(){
  fann_type *calc_out;
  // const unsigned int num_input = 256;
  // const unsigned int num_output = 256;
  // const unsigned int num_neurons_hidden = 256;
  const unsigned int num_layers = 2;
  const float desired_error = (const float) 0.00005;
  const unsigned int max_epochs = 10;
  const unsigned int epochs_between_reports = 1;
  struct fann *ann;
  struct fann_train_data *data;

  unsigned int decimal_point;

  printf(" Reading dataset ...\n");
  data = fann_read_train_from_file("./dataset/fann.test.dataset");

  printf(" Creating network ...\n");
  ann = fann_create_standard(num_layers, fann_num_input_train_data(data), fann_num_input_train_data(data), fann_num_output_train_data(data));
  // ann = fann_create_standard(num_layers, num_input, num_neurons_hidden, num_output);

  fann_set_activation_steepness_hidden(ann, 1);
  fann_set_activation_steepness_output(ann, 1);

  fann_set_activation_function_hidden(ann, FANN_SIGMOID_SYMMETRIC);
  fann_set_activation_function_output(ann, FANN_SIGMOID_SYMMETRIC);

  fann_set_train_stop_function(ann, FANN_STOPFUNC_BIT);
  fann_set_bit_fail_limit(ann, 0.01f);

  fann_set_training_algorithm(ann, FANN_TRAIN_RPROP);

  fann_init_weights(ann, data);
  
  printf("Training network.\n");
  fann_train_on_data(ann, data, max_epochs, epochs_between_reports, desired_error);

  printf("Testing network. %f\n", fann_test_data(ann, data));

  unsigned int total = fann_length_train_data(data);

  for(unsigned int i = 0; i < (total > 100 ? 100 : total) ; i++){
    calc_out = fann_run(ann, data->input[i]);
    printf(" test (%f,%f) -> %f, should be %f, difference=%f\n",
      data->input[i][0], data->input[i][1], calc_out[0], data->output[i][0], fann_abs(calc_out[0] - data->output[i][0]));
  }

  printf("Saving network.\n");

  fann_save(ann, "./fann.test.net");

  decimal_point = fann_save_to_fixed(ann, "./fann.test.fixed.net");
  fann_save_train_to_fixed(data, "./fann.test.fixed.data", decimal_point);

  printf("Cleaning up.\n");
  fann_destroy_train(data);
  fann_destroy(ann);

  return 0;
}
