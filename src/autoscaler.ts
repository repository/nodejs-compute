/*!
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {ServiceObject, util} from '@google-cloud/common';
import type {Metadata} from '@google-cloud/common';
import {promisifyAll} from '@google-cloud/promisify';

import type {BaseOptions} from './interfaces';
import type {OperationCallback} from './operation';
import type {Zone} from './zone';

export interface CreateAutoscalerOptions extends BaseOptions {
  target?: string;
  coolDown?: number;
  cpu?: number;
  loadBalance?: number;
  maxReplicas?: number;
  minReplicas?: number;
  autoscalingPolicy?: {
    mode?: string;
    coolDownPeriodSec?: number;
    cpuUtilization?: {utilizationTarget?: number};
    loadBalancingUtilization?: {utilizationTarget?: number};
    maxNumReplicas?: number;
    minNumReplicas?: number;
    scaleInControl?: {
      maxScaledInReplicas?: {fixed?: number; percent?: number};
      timeWindowSec?: number;
    };
    customMetricUtilizations?: {
      metric?: string;
      filter?: string;
      utilizationTarget?: number;
      singleInstanceAssignment?: string;
      utilizationTargetType?: 'GAUGE' | 'DELTA_PER_SECOND' | 'DELTA_PER_MINUTE';
    }[];
  };
}

/*! Developer Documentation
 *
 * @param {Zone} zone - Zone object this autoscaler belongs to.
 * @param {string} name - Name of the autoscaler.
 */
/**
 * Autoscalers allow you to automatically scale virtual machine instances in
 * managed instance groups according to an autoscaling policy that you define.
 *
 * @see [Autoscaling Groups of Instances]{@link https://cloud.google.com/compute/docs/autoscaler}
 *
 * @class
 * @param {Zone} zone
 * @param {string} name
 *
 * @example
 * const Compute = require('@google-cloud/compute');
 * const compute = new Compute();
 * const zone = compute.zone('us-central1-a');
 * const autoscaler = zone.autoscaler('autoscaler-name');
 */
export class Autoscaler extends ServiceObject {
  name: string;
  zone: Zone;
  constructor(zone: Zone, name: string) {
    const methods = {
      /**
       * Create an autoscaler.
       *
       * @method Autoscaler#create
       * @param {object} config - See {@link Zone#createAutoscaler}.
       *
       * @example
       * const Compute = require('@google-cloud/compute');
       * const compute = new Compute();
       * const zone = compute.zone('us-central1-a');
       * const autoscaler = zone.autoscaler('autoscaler-name');
       *
       * const config = {
       *   coolDown: 30,
       *   cpu: 80,
       *   loadBalance: 40,
       *   maxReplicas: 5,
       *   minReplicas: 0,
       *   target: 'instance-group-manager-1'
       * };
       *
       * const callback = function(err, autoscaler, operation, apiResponse) {
       *   // `autoscaler` is an Autoscaler object.
       *
       *   // `operation` is an Operation object that can be used to check the
       *   // of the request.
       * };
       *
       * autoscaler.create(config, callback);
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * autoscaler.create(config).then(function(data) {
       *   const autoscaler = data[0];
       *   const operation = data[1];
       *   const apiResponse = data[2];
       * });
       */
      create: true,
      /**
       * Check if the autoscaler exists.
       *
       * @method Autoscaler#exists
       * @param {function} callback - The callback function.
       * @param {?error} callback.err - An error returned while making this
       *     request.
       * @param {boolean} callback.exists - Whether the autoscaler exists or not.
       *
       * @example
       * const Compute = require('@google-cloud/compute');
       * const compute = new Compute();
       * const zone = compute.zone('us-central1-a');
       * const autoscaler = zone.autoscaler('autoscaler-name');
       *
       * autoscaler.exists(function(err, exists) {});
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * autoscaler.exists().then(function(data) {
       *   const exists = data[0];
       * });
       */
      exists: true,
      /**
       * Get an autoscaler if it exists.
       *
       * You may optionally use this to "get or create" an object by providing an
       * object with `autoCreate` set to `true`. Any extra configuration that is
       * normally required for the `create` method must be contained within this
       * object as well.
       *
       * @method Autoscaler#get
       * @param {options=} options - Configuration object.
       * @param {boolean} options.autoCreate - Automatically create the object if
       *     it does not exist. Default: `false`
       *
       * @example
       * const Compute = require('@google-cloud/compute');
       * const compute = new Compute();
       * const zone = compute.zone('us-central1-a');
       * const autoscaler = zone.autoscaler('autoscaler-name');
       *
       * autoscaler.get(function(err, autoscaler, apiResponse) {
       *   // `autoscaler` is an Autoscaler object.
       * });
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * autoscaler.get().then(function(data) {
       *   const autoscaler = data[0];
       *   const apiResponse = data[1];
       * });
       */
      get: true,
      /**
       * Get the metadata of this autoscaler.
       *
       * @method Autoscaler#getMetadata
       * @see [Autoscaler Resource]{@link https://cloud.google.com/compute/docs/reference/v1/autoscalers}
       * @see [Autoscalers: get API Documentation]{@link https://cloud.google.com/compute/docs/reference/v1/autoscalers/get}
       *
       * @param {function=} callback - The callback function.
       * @param {?error} callback.err - An error returned while making this
       *     request.
       * @param {object} callback.metadata - The autoscaler's metadata.
       * @param {object} callback.apiResponse - The full API response.
       *
       * @example
       * const Compute = require('@google-cloud/compute');
       * const compute = new Compute();
       * const zone = compute.zone('us-central1-a');
       * const autoscaler = zone.autoscaler('autoscaler-name');
       *
       * autoscaler.getMetadata(function(err, metadata, apiResponse) {});
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * autoscaler.getMetadata().then(function(data) {
       *   const metadata = data[0];
       *   const apiResponse = data[1];
       * });
       */
      getMetadata: true,
    };
    super({
      parent: zone,
      baseUrl: '/autoscalers',
      id: name,
      createMethod: zone.createAutoscaler.bind(zone),
      methods: methods,
      pollIntervalMs: zone.compute.pollIntervalMs,
    });
    /**
     * @name Autoscaler#name
     * @type {string}
     */
    this.name = name;
    /**
     * Parent {@link Zone} instance of this {@link Autoscaler} instance.
     * @name Autoscaler#zone
     * @type {Zone}
     */
    this.zone = zone;
  }
  delete(): Promise<[Metadata]>;
  delete(callback: OperationCallback): void;
  /**
   * Delete the autoscaler.
   *
   * @see [Autoscalers: delete API Documentation]{@link https://cloud.google.com/compute/docs/reference/v1/autoscalers/delete}
   *
   * @param {function=} callback - The callback function.
   * @param {?error} callback.err - An error returned while making this request.
   * @param {Operation} callback.operation - An operation object
   *     that can be used to check the status of the request.
   * @param {object} callback.apiResponse - The full API response.
   *
   * @example
   * const Compute = require('@google-cloud/compute');
   * const compute = new Compute();
   * const zone = compute.zone('us-central1-a');
   * const autoscaler = zone.autoscaler('autoscaler-name');
   *
   * autoscaler.delete(function(err, operation, apiResponse) {
   *   // `operation` is an Operation object that can be used to check the status
   *   // of the request.
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * autoscaler.delete().then(function(data) {
   *   const operation = data[0];
   *   const apiResponse = data[1];
   * });
   */
  delete(callback?: OperationCallback): void | Promise<[Metadata]> {
    callback = callback || util.noop;
    this.request({method: 'DELETE', uri: ''}, (err, resp) => {
      if (err) {
        callback!(err, null, resp);
        return;
      }
      const operation = this.zone.operation(resp.name);
      operation.metadata = resp;
      callback!(null, operation, resp);
    });
  }
  setMetadata(metadata?: Metadata): Promise<[Metadata]>;
  setMetadata(
    metadata: Metadata | undefined,
    callback: OperationCallback
  ): void;
  /**
   * Set the autoscaler's metadata.
   *
   * @see [Autoscaler Resource]{@link https://cloud.google.com/compute/docs/reference/v1/autoscalers}
   *
   * @param {object} metadata - See a
   *     [Firewall resource](https://cloud.google.com/compute/docs/reference/v1/autoscalers).
   * @param {function=} callback - The callback function.
   * @param {?error} callback.err - An error returned while making this request.
   * @param {Operation} callback.operation - An operation object
   *     that can be used to check the status of the request.
   * @param {object} callback.apiResponse - The full API response.
   *
   * @example
   * const Compute = require('@google-cloud/compute');
   * const compute = new Compute();
   * const zone = compute.zone('us-central1-a');
   * const autoscaler = zone.autoscaler('autoscaler-name');
   *
   * const metadata = {
   *   description: 'New description'
   * };
   *
   * autoscaler.setMetadata(metadata, function(err, operation, apiResponse) {
   *   // `operation` is an Operation object that can be used to check the status
   *   // of the request.
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * autoscaler.setMetadata(metadata).then(function(data) {
   *   const operation = data[0];
   *   const apiResponse = data[1];
   * });
   */
  setMetadata(
    metadata?: Metadata,
    callback?: OperationCallback
  ): void | Promise<[Metadata]> {
    callback = callback || util.noop;
    const json = metadata || {};
    json.name = this.name;
    json.zone = this.zone.name;
    this.zone.request(
      {method: 'PATCH', uri: '/autoscalers', qs: {autoscaler: this.name}, json},
      (err, resp) => {
        if (err) {
          callback!(err, null, resp);
          return;
        }
        const operation = this.zone.operation(resp.name);
        operation.metadata = resp;
        callback!(null, operation, resp);
      }
    );
  }
}

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Autoscaler);